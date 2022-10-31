export const Config = () => ({
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity.{js, ts}'],
    synchronize: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '365d' },
  },
});
