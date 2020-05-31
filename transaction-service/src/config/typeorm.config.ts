import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/transaction.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mssql',
    host: 'localhost',
    port: 55659,
    username: 'sa',
    password: 'qwerty123',
    database: 'pwtransactions',
    entities: [Transaction],
    synchronize: true,
}