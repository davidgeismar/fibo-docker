import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  }

  componentDidMount(){
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues(){
    // querying redis
    const values = await axios.get('api/values/current');
    this.setState({
      values: values.data
    });
  }

  async fetchIndexes() {
    // querying database
    const seenIndexes = await axios.get('api/values/all');
    this.setState({
      seenIndexes: seenIndexes.data
    });
  }

  renderSeenIndexes(){
    return this.state.seenIndexes.map(({index}) => index ).join(', ');
  }
  renderValues(){
    const entries = [];
    for (let key in this.state.values){
      entries.push(
        <div key={key}>
          for index {key}, I have calculated {this.state.values[key]}
        </div>
      )
    }
    return entries;
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state.index);
    // storing index in db and calculating value with redis
    await axios.post('/api/values', {
      index: this.state.index
    });
    this.setState({index: ''});
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={event => this.setState({index: event.target.value})}
          />
          <button>Submit </button>
        </form>
        <h3>Indexes I have seen </h3>

        {this.renderSeenIndexes()}

        <h3> Calculated values </h3>
        {this.renderValues()}
      </div>
    )
  }
}

export default Fib;
