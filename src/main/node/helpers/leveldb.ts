import leveldown from 'leveldown';
import levelup from 'levelup';

export default {
  levelDb: levelup(leveldown('./desktopKoiiNodeDB')),
};
