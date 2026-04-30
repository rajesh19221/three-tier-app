import { Component } from "react";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
} from "./services/taskServices";

class Tasks extends Component {
  state = { tasks: [], currentTask: "" };

  async componentDidMount() {
    try {
      const { data } = await getTasks();
      this.setState({ tasks: data });
    } catch (error) {
      console.log(error);
    }
  }

  handleChange = ({ currentTarget: input }) => {
    this.setState({ currentTask: input.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addTask({ task: this.state.currentTask });
      this.setState({
        tasks: [...this.state.tasks, data],
        currentTask: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleUpdate = async (id) => {
    const tasks = [...this.state.tasks];
    const index = tasks.findIndex((task) => task._id === id);
    tasks[index].completed = !tasks[index].completed;
    this.setState({ tasks });

    try {
      await updateTask(id, {
        completed: tasks[index].completed,
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleDelete = async (id) => {
    const tasks = this.state.tasks.filter((task) => task._id !== id);
    this.setState({ tasks });

    try {
      await deleteTask(id);
    } catch (error) {
      console.log(error);
    }
  };
}

export default Tasks;
