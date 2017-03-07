
/**
 * Created by mitch on 2/7/2017.
 */

let Config = {

    /* Developer Mode (FALSE in production!!) */
    DEV_MODE : false,

    /* Web Socket Configs */
    WEB_SOCKET : {
        HOST: 'localhost',
        PORT: 447
    },

    /* Location Database Configs */
    LOCATION_DB : {
        HOST: '72.90.86.178',
        PORT: 5432,
        DATABASE: 'ghost',
        USERNAME: 'postgres',
        PASSWORD: 'halfmoon'
    },

    /* User Database Configs */
    USER_DB : {
        HOST: '72.90.86.178',
        PORT: 5432,
        DATABASE: 'ghost_users',
        USERNAME: 'postgres',
        PASSWORD: 'halfmoon'
    },

    /* Social SQL Database Configs */
    SOCIAL_SQL_DB : {
        HOST: '72.90.86.178',
        PORT: 5432,
        DATABASE: 'ghost',
        USERNAME: 'postgres',
        PASSWORD: 'halfmoon'
    },

    /* Social NoSQL Database Configs */
    SOCIAL_NoSQL_DB : {
        HOST: '72.90.86.178',
        PORT: 5432,
        DATABASE: 'ghost',
        USERNAME: 'postgres',
        PASSWORD: 'halfmoon'
    }
};

module.exports = Config;