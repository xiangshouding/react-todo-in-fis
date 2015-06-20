/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

'use strict';

/**
 * @require ./utils.js
 */
import {Utils} from "./utils.js";

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
export class TodoModel {
  constructor (key) {
    this.key = key;
    this.todos = Utils.store(key);
    this.onChanges = [];
  }

  subscribe (onChange) {
    this.onChanges.push(onChange);
  }

  inform () {
    Utils.store(this.key, this.todos);
    this.onChanges.forEach(function (cb) { cb(); });
  }

  addTodo (title) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title: title,
      completed: false
    });

    this.inform();
  }

  toggleAll (checked) {
    // Note: it's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map() and filter() everywhere instead of mutating the array or
    // todo items themselves.
    this.todos = this.todos.map((todo) => {
      return Utils.extend({}, todo, {completed: checked});
    });

    this.inform();
  }

  toggle (todoToToggle) {
    this.todos = this.todos.map((todo) => {
      return todo !== todoToToggle ?
        todo :
        Utils.extend({}, todo, {completed: !todo.completed});
    });

    this.inform();
  }

  destroy (todo) {
    this.todos = this.todos.filter((candidate) => {
      return candidate !== todo;
    });

    this.inform();
  }

  save (todoToSave, text) {
    this.todos = this.todos.map((todo) => {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
    });

    this.inform();
  }

  clearCompleted () {
    this.todos = this.todos.filter((todo) => {
      return !todo.completed;
    });

    this.inform();
  }
}
