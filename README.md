# Simple Validators module for Meteor Astronomy 

**Table of Contents**
- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Validators](#validators)
- [Writing validators](#writing-validators)
- [Contribution](#contribution)
- [License](#license)

## About

Meteor Astronomy Simple Validators is a module for [Meteor Astronomy](https://github.com/jagi/meteor-astronomy) package that introduces validation feature into you model. Validators are nice way of checking fields values' validity. For instance, we can check whether given field value is an email string or matches given regular expression. You can also write your own validators.

This package is an extension of the core validation package [`jagi:astronomy-validators`](https://github.com/jagi/meteor-astronomy). The core package uses functional validators where
writing validation rules requires a little bit more of code to be written. However functional validators are faster and more powerful then simple validators in this package. The simple validators are a lot more concise.

## Installation

To use the simple validators package you don't have to add core `jagi:astronomy-validators` package. It's a dependency for simple validators package and it will be added automatically.

```sh
$ meteor add jagi:astronomy-simple-validators
```

## Usage

Let's see how to add validators to our model.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  simpleValidators: {
    title: 'minlen(5)'
  }
});
```

As you can see, we've added `minlen` (alias for `minLength`) validator to the `title` field. The validation rules have to be written in the form of a string. We just write a validator name as it would be a function and pass a parameter in the parentheses. The `minLength` validator is one of many predefined validation functions. All validators from `jagi:astronomy-validators` package can be used in the `jagi:astronomy-simple-validators` package. However, there are some limitations. We can't pass function or object as a parameter of validator. Almost any custom validator written for the `jagi:astronomy-validators` package should work as simple validator.

There is also a way of passing a custom error message to validator. We can do it using following code.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  simpleValidators: {
    title: {
      rules: 'minlen(5)',
      messages: {
        minlen: 'Title is to short!'
      }
    }
  }
});
```

As you can see, instead passing a string rules, we pass object with `rules` and `messages` properties. The `messages` value is an object of key - value pairs, where the key is a validator name and the value is an error message for given validator.

We also have several ways of adding validators to already defined schema.

```js
Post.addValidator('email', 'email');

Post.addValidators({
  title: 'str',
  email: 'email'
});
```

For now, we've shown how to add a single validator per field, but what about multiple validation rules. Like in the core validation package, we have to use `and` or `or` validators.

```js
Post.addValidators({
  title: 'and([str,minlen(5),required])'
});
```

## Validators

The list of all available validators can be found in the Validators section for the `jagi:astronomy-validators` package which you can find [here](https://github.com/jagi/meteor-astronomy-validators#validators).

## Writing validators

The description of how to write custom validator can also be found in the [documentation](https://github.com/jagi/meteor-astronomy-validators#writing-validators) for the `jagi:astronomy-validators` package.

## Contribution

If you have any suggestions or want to write new modules please contact me, or just create issue or pull request.

## License

MIT
