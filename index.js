const React = require('react')
,   ReactDOM = require('react-dom')
,   R = require('ramda')
,   _ = require('lodash')
,   $ref = falcor.Model.ref
,   $atom = falcor.Model.atom
,   model = new falcor.Model({
    cache: {
        ingredientsById: {
            1: {
                name: 'flour',
                description: 'white and powdery'
            },
            2: {
                name: 'chocolar',
                description: 'yum'
            }
        },
        recipes: [
            {
                name: 'Cookies',
                instructions: 'bake em',
                ingredients: [
                    $ref("ingredientsById[1]"),
                    $ref("ingredientsById[2]"),
                ],
                authors: $atom(['Brian', 'John', 'Agatha', 'other'])
            },
            {
                name: 'brownies',
                instructions: 'bake',
                ingredients: [
                    { $type: 'ref', value: ['ingredientsById', 2]},
                ],
                authors: { $type: 'atom', value: ['Ringo', 'Sam']}
            },
            {
                name: 'Cake',
                instructions: 'mix then bake',
                ingredients: [
                    { $type: 'ref', value: ['ingredientsById', 1] },
                    { $type: 'ref', value: ['ingredientsById[2]'] },
                ]
            }
        ]
    }
    // source: new falcor.HttpDataSource('./model.json')
})

model.get(
    'recipes[0..2].ingredients[0..9]["name", "ingredients"]',
    'recipes[0..2]["name", "instructions", "authors"]'
    )
    .then(data => {
        console.log(data)
    })
    
    // <RecipeList recipes={[{name: 'Brownies', instructions: 'bake', ingredients: ['flour']}]} />
const App = React.createClass({
    render() {
        return (
            <div>
                <RecipeList />
            </div>
        )
    }
})
const RecipeList = React.createClass({
    getInitialState() {
        return {
            recipes: []
        }
    },
    componentWillMount() {
        model.get(
            ['recipes', {from:0, to:1}, Recipe.queries.recipe()],
            ['recipes', {from:0, to:1}, 'ingredients', {from:0, to:9}, Ingredients.queries.ingredients()]
        )
        .then(data => {
            this.setState({
                recipes: _.values(data.json.recipes)
            })
            console.log(_.values(data.json.recipes))
        })
    },
    // {this.props.recipes.map((r, i) => (
    render() {
        return (
            <div>
                {this.state.recipes.map((r, i) => (
                    <Recipe {...r} key={i} />
                ))}
            </div>
        )
    }
})
const Recipe = React.createClass({
    statics: {
        queries: {
            recipe() {
                return _.union(
                    Name.queries.recipe(),
                    Instructions.queries.recipe()
                )
                // return ['ingredients']
            },
            ingredients() {
                return Ingredients.queries.ingredients()
                // return Ingredients.queries.recipes()
            }
        }
    },
    render() {
        // <Name name={this.props.name} />
        // <Instructions instructions={this.props.instructions} />
        return (
            <div>
                <Name { ..._.pick(this.props, Name.queries.recipe()) } />
                <Instructions {..._.pick(this.props, Instructions.queries.recipe())} />
                <Ingredients ingredients={this.props.ingredients} />
            </div>
        )
    }
})
const Name = React.createClass({
    statics: {
        queries: {
            recipe() {
                return ['name', 'authors']
            }
        }
    },
    render() {
        return (
            <div>
                <h1>{this.props.name}</h1>
                <h1>{JSON.stringify(this.props.authors)}</h1>
            </div>
        )
    }
})
const Instructions = React.createClass({
    statics: {
        queries: {
            recipe() {
                return ['instructions']
            }
        }
    },
    render() {
        return (
            <h1>{this.props.instructions}</h1>
        )
    }
})

const Ingredients = React.createClass({
    statics: {
        queries: {
            ingredients() {
                return ["name", "description"]
                // return ['ingredients']
            }
        }
    },
    render() {
        return (
            <h1>{JSON.stringify(this.props.ingredients)}</h1>
        )
    }
})

ReactDOM.render( <App />, window.document.getElementById('target'))