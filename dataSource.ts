import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();

const dataSource = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/src/entities/**/*{.ts,.js}'],
    migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
    seeders: [__dirname + '/src/database/seeds/**/*{.ts,.js}'],
    charset: 'utf8mb4_general_ci',
    synchronize: false,
    logging: true,
} as SeederOptions & DataSourceOptions);

export default dataSource;
