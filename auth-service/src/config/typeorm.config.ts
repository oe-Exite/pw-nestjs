import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthUser } from '../auth/auth.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mssql',
    host: 'localhost',
    port: 55659,
    username: 'sa',
    password: 'qwerty123',
    database: 'pwauth',
    entities: [AuthUser],
    synchronize: true,
}