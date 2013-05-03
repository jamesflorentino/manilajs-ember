App = Ember.Application.create({
  ready: function() {
    var json;
    try {
      json = JSON.parse(localStorage.getItem('contacts'));
    } catch(err) {
      json = [];
    }
    App.users = json;
  }
});

App.contactsController = Ember.Controller.create({
  createContact: function() {
    App.users.addObject({});
    this.saveContacts();
  },
  saveContacts: function() {
    var jsonString = JSON.stringify(App.users);
    localStorage.setItem('contacts', jsonString);
  },
  removeContact: function(contact) {
    App.users.removeObject(contact);
  }
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('contacts');
  }
});

App.Router.map(function() {
  this.resource('contacts');
});

App.ApplicationController = Ember.Controller.extend({
  appName: 'Contacts'
});

App.ContactView = Ember.View.extend({
  init: function() {
    var content = this.get('content');
    if (!content.firstName && !content.lastName) {
      this.edit();
    }
    this._super();
  },
  templateName: 'contact',
  isEditing: false,
  edit: function() {
    this.set('isEditing', true);
  },
  done: function() {
    var content = this.get('content');
    this.set('isEditing', false);
    if (!content.firstName && !content.lastName) {
      App.contactsController.removeContact(content);
    }
    App.contactsController.saveContacts();
  },
  remove: function() {
    App.users.removeObject(this.get('content'));
    App.contactsController.saveContacts();
  }
});

App.AutoFocusTF = Ember.TextField.extend({
  attributeBindings: ['autofocus'],
  autofocus: true
});

Ember.Handlebars.registerBoundHelper('twitterPic', function(value, options) {
  var imageAPI = "https://api.twitter.com/1/users/profile_image?screen_name=" + value;
  var imageTag = "<img src='" + imageAPI + "' class='" + options.hash.class + "' alt='Twitter Pic' />";
  return value ? Ember.String.htmlSafe(imageTag) : '';
});
