import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"
import "./index.css"

const GET_TODOS = gql`
  {
    todos {
      task
      id
      status
    }
  }
`
const ADD_TODO = gql`
  mutation addTodo($task: String!) {
    addTodo(task: $task) {
      task
    }
  }
`
const DEL_TODO = gql`
  mutation delTodo($id: String!) {
    delTodo(id: $id) {
      task
    }
  }
`
export default function Home() {
  let inputText

  const [addTodo] = useMutation(ADD_TODO)
  const [delTodo] = useMutation(DEL_TODO)
  const addTask = () => {
    addTodo({
      variables: {
        task: inputText.value,
      },
      refetchQueries: [{ query: GET_TODOS }],
    })
    inputText.value = ""
  }

  const delTask = id => {
    delTodo({
      variables: {
        id: id,
      },
      refetchQueries: [{ query: GET_TODOS }],
    })
  }

  const { loading, error, data } = useQuery(GET_TODOS)

  if (loading) return <h2 className='Loding_contain'>Loading..</h2>

  if (error) {
    console.log(error)
    return <h2>Error</h2>
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="today">
          <h2>Tasks</h2>
        </div>
      </div>
      <div className="app-body">
        <ul v-if="todos.length>0">
          <li className="todo-list" v-for="(todo,index) in todos">
            <div className="list-item-view">
              <div className="item">
                {data.todos.map(todo => {
                  console.log(todo)
                  return (
                    <div className='task_div' key={todo.id}>
                      <ul><li>{todo.task}</li></ul>
                      <button
                        onClick={() => delTask(todo.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="app-form">
        <input
          placeholder="Add Todo.."
          v-model="newTodo"
          type="text"
          className="input-text"
          name=""
          ref={node => {
            inputText = node
          }}

        />
        <button className="btn btn-danger" onClick={addTask}>
          Add
        </button>
      </div>
    </div>
  )
}
