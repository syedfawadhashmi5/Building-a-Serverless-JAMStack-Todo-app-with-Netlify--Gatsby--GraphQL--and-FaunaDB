const { ApolloServer, gql } = require("apollo-server-lambda")
var faunadb = require("faunadb"),
  q = faunadb.query




const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
    delTodo(id: String!): Todo
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({
          secret: 'fnAD-Pc9BcACB5qyODsTVmFMS-Gynn_NoxYxgr6a',
        })
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("task"))),
            q.Lambda(x => q.Get(x))
          )
        )


        return result.data.map(d=>{
          return {
            id:  d.ref.id,
            status: d.data.status,
            task: d.data.task
          }
        })

      } catch (err) {
        console.log(err)
      }
    },
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({
          secret: 'fnAD-Pc9BcACB5qyODsTVmFMS-Gynn_NoxYxgr6a',
        })
        const result = await adminClient.query(
          q.Create(q.Collection("todolist"), {
            data: {
              task: task,
              status: true,
            },
          })
        )
        return result.ref.data
      } catch (err) {
        console.log(err)
      }
    },
    delTodo: async (_, { id }) => {

      try {
        var adminClient = new faunadb.Client({ secret: 'fnAD-Pc9BcACB5qyODsTVmFMS-Gynn_NoxYxgr6a' });
        const result = await adminClient.query(
          q.Delete(q.Ref(q.Collection("todolist"), id))
        )
        return result.ref.data;
      }
      catch (err) {
        console.log(err)
      }

    }
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
