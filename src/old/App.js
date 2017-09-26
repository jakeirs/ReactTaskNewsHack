import React, {Component} from 'react';
// import Div from './Div';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

var searchTerm = 'redux';
var url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}`;


const isSearched = (searchTerm) => item =>
!searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        }

    }

    setSearchTopstories = (result) => {
        this.setState({ result });
    }

    fetchSearchTopstories = (searchTerm, page) => {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
            .then(response => response.json())
            .then(result => this.setSearchTopstories(result));
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    onSearchChange = (event) => {
        this.setState({
            searchTerm: event.target.value,
        })
    }

    onSearchSubmit = (event) => {
        const { searchTerm } = this.state;
        this.fetchSearchTopstories( searchTerm, DEFAULT_PAGE );
        event.preventDefault();
    }

    onDismiss = (id) => {
        const updatedHits = this.state.result.hits.filter((item) => item.objectID !== id);
        this.setState({
            result: { ...this.state.result, hits: updatedHits }
        }, ()=> console.log(this.state))
    }

    render() {
        const {result, searchTerm} = this.state;
        const page = (result && result.page) || 0;
        return (
            <div className="page">
                <div className="interactions">
                    <Search
                        value={searchTerm}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    >
                        Szukaj...
                    </Search>
                </div>
                { result &&
                <Table
                    list={result.hits}
                    onDismiss={this.onDismiss}
                />
                }
                <div className="interactions">
                    <Button onClick={() => this.fetchSearchTopstories(searchTerm, page + 1)}>
                        More {page}
                    </Button>
                </div>
            </div>
        );
    }
}

const Search = ({value, onChange, onSubmit, children}) => {
    return (
        <form onSubmit={onSubmit}>
            {children}
            <input
                type="text"
                value={value}
                onChange={onChange}
            />
            <button
                type="submit"
            >
                {children}
            </button>
        </form>
    )
}


const Table = ({ list, onDismiss}) =>
    <div className="table">
        {
            list.map((item) => (
                <div key={item.objectID}
                     className="table-row"
                >
                     <span style={{width: '40%'}}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={{width: '30%'}}>
                      {item.author}
                    </span>
                    <span style={{width: '10%'}}>
                      {item.num_comments}
                    </span>
                    <span style={{width: '10%'}}>
                      {item.points}
                    </span>
                    <span style={{width: '10%'}}>
                        <Button
                            onClick={() => onDismiss(item.objectID)}
                            className="button-inline"
                        >
                            Dismiss
                        </Button>
                    </span>
                </div>
            ))
        }
    </div>

const Button = ({onClick, children, className = ''}) => {
    return (
        <button
            onClick={ onClick }
            className={className}
            type="button"
        >
            {children}
        </button>
    )
}


export default App;
