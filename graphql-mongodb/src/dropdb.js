import mongoose from 'mongoose'

mongoose
  .connect(
    'mongodb://localhost:27017/graphql-example',
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then(mongooseConnection => {
    return mongooseConnection.connection.db.dropDatabase();
  })
  .then(() => {
    console.log('Dropped database');
    process.exit(0)
  })
  .catch(err => console.error(err));
