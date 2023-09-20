/* eslint-disable consistent-return */
import { randomUUID } from 'crypto';

import { CronJob } from 'cron';
import { parse, isBefore, Interval, areIntervalsOverlapping } from 'date-fns';

import { SystemDbKeys } from 'config/systemDbKeys';
import { clone, isNil, isNumber } from 'lodash';
import {
  ErrorType,
  Schedule,
  ScheduleMetadata,
  ScheduleMetadataUpdateType,
  TimeFormat,
} from 'models';
import { throwDetailedError } from 'utils';

import getUserConfig from '../controllers/getUserConfig';
import { NodeNamespace } from '../NodeNamespace';

import { getCronTime } from './utils/getCronTime';

export class TaskSchedulerService {
  private namespace: NodeNamespace;

  private scheduleStartAction: () => Promise<void>;

  private scheduleEndAction: () => Promise<void>;

  public schedules: Map<string, Schedule> = new Map();

  constructor(
    namespace: NodeNamespace,
    scheduleStartAction: () => Promise<void>,
    scheduleEndAction: () => Promise<void>
  ) {
    console.log('CREATING SCHEDULER INSTANCE');
    this.namespace = namespace;
    this.scheduleStartAction = scheduleStartAction;
    this.scheduleEndAction = scheduleEndAction;

    this.loadAndStartSchedules();
  }

  private async loadAndStartSchedules() {
    const schedules = await this.getSchedulesFromDb();
    const userConfig = await getUserConfig();

    schedules.forEach((schedule) => {
      const fullSchedule = {
        ...schedule,
        startJob: this.createCronJob(
          this.scheduleStartAction,
          schedule.startTime,
          schedule.days,
          schedule.id
        ),
        stopJob: schedule.stopTime
          ? this.createCronJob(
              this.scheduleEndAction,
              schedule.stopTime,
              schedule.days,
              schedule.id
            )
          : null,
      };
      this.schedules.set(schedule.id, fullSchedule);

      if (isNumber(userConfig.stayAwake) && schedule.isEnabled) {
        fullSchedule.startJob.stop();
        fullSchedule.stopJob?.stop();
      }
    });
  }

  async getSchedulesFromDb() {
    const schedulesJson = await this.namespace.storeGet(SystemDbKeys.Schedules);
    return (JSON.parse(schedulesJson) as ScheduleMetadata[]) || [];
  }

  async getSchedule(id: string) {
    const schedules = await this.getSchedulesFromDb();
    console.log('###LOOKS FOR SCHEDULE: ', id, schedules);
    return schedules.find((schedule) => schedule.id === id);
  }

  private async saveSchedulesToDb() {
    const schedules: ScheduleMetadata[] = Array.from(
      this.schedules.values()
    ).map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ startJob, stopJob, ...rest }) => rest
    );
    await this.namespace.storeSet(
      SystemDbKeys.Schedules,
      JSON.stringify(schedules)
    );
  }

  // eslint-disable-next-line class-methods-use-this
  public createCronJob(
    action: () => Promise<void>,
    actionTime: TimeFormat,
    days: number[],
    id: string
  ): CronJob {
    const cronTime = getCronTime(actionTime, days);

    console.log('createCronJob', cronTime, actionTime, days);

    return new CronJob(cronTime, () => {
      console.log(
        `Action Time for Schedule Id ${id}, action time ${actionTime}`
      );
      return action();
    });
  }

  public async setTaskSchedule({
    id,
    startTime,
    stopTime,
    days,
    isEnabled,
  }: ScheduleMetadata) {
    const scheduleId = id || randomUUID();

    const schedule: Schedule = {
      id: scheduleId,
      startTime,
      stopTime,
      days,
      isEnabled,
      startJob: this.createCronJob(
        this.scheduleStartAction,
        startTime,
        days,
        scheduleId
      ),
      stopJob: stopTime
        ? this.createCronJob(this.scheduleEndAction, stopTime, days, scheduleId)
        : null,
    };

    this.schedules.set(scheduleId, schedule);

    await this.saveSchedulesToDb();
  }

  private checkIsScheduleInConflict(
    checkedScheduleId: string,
    checkedStartTime: Date,
    checkedStopTime: Date | null,
    checkedDays: number[]
  ): boolean {
    if (!checkedStopTime) {
      return false;
    }

    const checkedInterval: Interval = {
      start: checkedStartTime,
      end: checkedStopTime,
    };

    return Array.from(this.schedules.values()).some((schedule) => {
      if (schedule.id === checkedScheduleId) {
        return false;
      }

      const startParsed = parse(schedule.startTime, 'HH:mm:ss', new Date());
      const stopParsed = schedule.stopTime
        ? parse(schedule.stopTime, 'HH:mm:ss', new Date())
        : null;

      if (!stopParsed) {
        return false;
      }

      const iteratedInterval: Interval = {
        start: startParsed,
        end: stopParsed,
      };
      if (areIntervalsOverlapping(checkedInterval, iteratedInterval)) {
        return checkedDays.some((day) => schedule.days.includes(day));
      }
      return false;
    });
  }

  async updateTaskSchedule(
    scheduleData: ScheduleMetadataUpdateType
  ): Promise<void> {
    const {
      id,
      startTime: newStartTime,
      stopTime: newStopTime,
      days: newDays,
      isEnabled: newIsEnabled,
    } = scheduleData;

    const schedule = clone(this.schedules.get(id));

    if (schedule) {
      const startParsed = parse(
        newStartTime || schedule.startTime,
        'HH:mm:ss',
        new Date()
      );
      const stopParsed = newStopTime
        ? parse(newStopTime, 'HH:mm:ss', new Date())
        : null;

      if (!startParsed || (stopParsed && isBefore(stopParsed, startParsed))) {
        return throwDetailedError({
          detailed: `Invalid time range. Start time ${startParsed}, Stop time ${stopParsed}`,
          type: ErrorType.INVALID_SCHEDULE_SESSION_TIME_RANGE,
        });
      }

      if (newStartTime === newStopTime) {
        return throwDetailedError({
          detailed: `Invalid time range. Start time ${startParsed}, Stop time ${stopParsed}`,
          type: ErrorType.SCHEDULE_SAME_START_STOP_TIMES,
        });
      }

      if (newDays && newDays !== schedule.days) {
        schedule.days = newDays;
      }

      // check for overlap / conflicts
      if (
        this.checkIsScheduleInConflict(
          schedule.id,
          startParsed,
          stopParsed,
          schedule.days
        )
      ) {
        return throwDetailedError({
          detailed: `Conflict. ID ${schedule.id}`,
          type: ErrorType.SCHEDULE_OVERLAP,
        });
      }

      if (!schedule.days.length) {
        return throwDetailedError({
          detailed: `Missing days. ID ${schedule.id}`,
          type: ErrorType.SCHEDULE_NO_SELECTED_DAYS,
        });
      }

      const isStayAwake = isNumber((await getUserConfig()).stayAwake);

      if (newStartTime && newStartTime !== schedule.startTime) {
        schedule.startJob.stop();
        schedule.startTime = newStartTime;
        schedule.startJob = this.createCronJob(
          this.scheduleStartAction,
          schedule.startTime,
          schedule.days,
          id
        );

        if (schedule.isEnabled && isStayAwake) {
          schedule.startJob.start();
        }
      }

      if (newStopTime !== schedule.stopTime) {
        schedule.stopJob?.stop();
        schedule.stopTime = newStopTime || null;

        schedule.stopJob = newStopTime
          ? this.createCronJob(
              this.scheduleEndAction,
              schedule.stopTime as TimeFormat,
              schedule.days,
              id
            )
          : null;

        if (schedule.isEnabled && isStayAwake) {
          schedule.stopJob?.start();
        }
      }

      if (!isNil(newIsEnabled) && schedule.isEnabled !== newIsEnabled) {
        if (newIsEnabled && isStayAwake) {
          if (!schedule.startJob.running) schedule.startJob.start();
          if (!schedule.stopJob?.running) schedule.stopJob?.start();
        } else {
          if (schedule.startJob.running) schedule.startJob.stop();
          if (schedule.stopJob?.running) schedule.stopJob?.stop();
        }
      }

      // Save the updated schedule to the map
      this.schedules.set(id, schedule);

      // Save the updated schedules metadata to the database
      await this.saveSchedulesToDb();
    } else {
      return throwDetailedError({
        detailed: `Schedule with ID ${id} does not exist.`,
        type: ErrorType.GENERIC,
      });
    }
  }

  public async removeSchedule(id: string) {
    const schedule = this.schedules.get(id);
    if (schedule) {
      schedule.startJob.stop();
      this.schedules.delete(id);
      await this.saveSchedulesToDb();
    }
  }
}
