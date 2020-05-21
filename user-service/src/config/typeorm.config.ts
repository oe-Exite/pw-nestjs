import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mssql',
    host: 'localhost',
    port: 55659,
    username: 'sa',
    password: 'qwerty123',
    database: 'pwusers',
    entities: [User],
    synchronize: true,
}