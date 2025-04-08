import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HOSTNAME, NEO4J_PASSWORD, NEO4J_USER } from 'config';
import { Connection } from 'cypher-query-builder';
import { join } from 'path';
import { TenderResolver } from './tender/tender.resolver';
import { TenderService } from './tender/tender.service';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: false,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'), // <- Для типов-классов
        outputAs: 'class',
      },
      driver: ApolloDriver,
    }),
  ],
  providers: [
    TenderResolver,
    TenderService,
    {
      provide: 'NEO4J',
      useValue: new Connection(HOSTNAME, {
        username: NEO4J_USER,
        password: NEO4J_PASSWORD,
      }),
    },
  ],
})
export class AppModule {}
