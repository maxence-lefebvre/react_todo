import React from 'react';
import {Input, Row, Table, Icon, Button} from 'react-materialize'

import data from './data'

export default class App extends React.PureComponent {
  constructor(props){
    super(props);

    this.state = {
      todos: [],
      next_id: 0,
      filtered: { tab:"all", todos: []}
    };
  }

  componentWillMount(){
    this.setState({
      todos: data.todos,
      next_id: data.next_id,
      filtered: {todos: data.todos}
    });
  }

  componentDidUpdate(){
    console.log('updating');
  }

  addElement(title){
    let newTodos = this.state.todos;

    newTodos.push({
      id: this.state.next_id,
      title: title,
      state: 1
    });

    this.setState({
      todos: newTodos,
      next_id: this.state.next_id + 1
    })
  }

  handleSubmit = (e) => {
    if(e.key === "Enter"){
        this.addElement(e.target.value);
        e.target.value = "";
    }
  }

  updateJson(state){
    // Possible de MAJ le fichier JSON ? google n'a pas l'air de cet avis
  }

  updateElement(element, e){
    // Pourquoi si j'appele onClick=update(element), je recupère l'event dans element et non mon objet ?
    // Pourquoi sans .bind ma fonction est appellé au render() du composant ?
    // De meme j'appele update.bind(this, element) et je recupère (element, event) --> Ordre inverse ??
    // console.log(e, 'e');
    // console.log(element, 'element');
    // Pourquoi .slice() obligatoire ? (sinon uniquement update au premier click)
    let newTodos = this.state.todos.slice();
    let elementPos = newTodos.map(function(x) {return x.id; }).indexOf(element.id);

    // On update aussi nos filters
    let newFilteredTodos = this.state.filtered.todos.slice();
    let elementPosFiltered = newFilteredTodos.map(function(x) {return x.id; }).indexOf(element.id);


    if (element.state === 1) {
      newTodos[elementPos].state = 0
      if(this.state.filtered.tab === "active"){newFilteredTodos.splice(elementPosFiltered, 1)}
    }else if(element.state === 0) {
      newTodos[elementPos].state = 1
      if(this.state.filtered.tab === "done"){newFilteredTodos.splice(elementPosFiltered, 1)}
    }

    this.setState({
      todos: newTodos,
      next_id: this.state.next_id,
      filtered: {todos: newFilteredTodos}
    })
  }

  deleteElement(element, e){
    let newTodos = this.state.todos.slice();
    let elementPos = newTodos.map(function(x) {return x.id; }).indexOf(element.id);
    newTodos.splice(elementPos, 1);

    // On update aussi nos filters
    let newFilteredTodos = this.state.filtered.todos.slice();
    let elementPosFiltered = newFilteredTodos.map(function(x) {return x.id; }).indexOf(element.id);
    newFilteredTodos.splice(elementPosFiltered, 1);

    this.setState({
      todos: newTodos,
      next_id: this.state.next_id,
      filtered: {todos: newFilteredTodos}
    })
  }

  filterElements = (e) =>{
    let newTodos = this.state.todos.slice();
    let tab = e.target.name

    if (tab === "active") {
      newTodos = newTodos.filter(x => x.state === 1);
    } else if (tab === "done") {
      newTodos = newTodos.filter(x => x.state === 0);
    }

    this.setState({
      filtered: {tab: tab, todos: newTodos}
    })
  }

  render() {
    let elementToDisplay = this.state.todos;
    // Pourquoi tab est undefined au mount du composant?
    if (this.state.filtered.tab !== "all"){
      console.log('filtered', (this.state.filtered.tab));
      elementToDisplay = this.state.filtered.todos
    };
    return (
    <Row>
          <Input id="input" onKeyPress={this.handleSubmit} type="text" label="What needs to be done ?" s={12} />
          <Table>
	         <tbody>
            {elementToDisplay.map(element =>
              <tr key={element.id} className={element.state === 1 ? "actif" : "no-actif"}>
                <td onClick={this.updateElement.bind(this, element)}><Icon>check</Icon></td>
                <td >{element.title}</td>
                <td onClick={this.deleteElement.bind(this, element)}><Icon>clear</Icon></td>
              </tr>
            )}
          </tbody>
        </Table>
        <Button waves='light' onClick={this.filterElements} name='all'>All</Button>
    		<Button waves='light' onClick={this.filterElements} name='active'>Active</Button>
    		<Button waves='light' onClick={this.filterElements} name='done'>Done</Button>
      </Row>
    )
  }
}
