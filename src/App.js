import React, {Component, PropTypes} from 'react';
// import Div from './Div';
import './App.css';
import { sortBy } from 'lodash';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '20';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

var searchTerm = 'redux';
var url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;

const SORTS = {
    NONE: (list) => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
}


const isSearched = (searchTerm) => item =>
!searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const updateSearchTopstoriesState = (hits, page) => prevState => {
    const { searchKey, results } = prevState;

    const oldHits = results && results[searchKey]
        ? results[searchKey].hits
        : [];
    const updatedHits = [
        ...oldHits,
        ...hits
    ];

    return {
        results: {
            ...results,
            [searchKey]: { hits: updatedHits, page }
        },
        isLoading: false
    };
}


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            isLoading: false,
        }

    }

    setSearchTopstories = (result) => {
        const {hits, page} = result;

        this.setState(updateSearchTopstoriesState(hits, page));
    }


    needsToSearchTopstories = (searchTerm) =>
        // if searchTerm exists in cache return false
        !this.state.results[searchTerm]



    fetchSearchTopstories = (searchTerm, page) => {
        this.setState({
            isLoading: true
        });
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopstories(result));
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm })
        this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    onSearchChange = (event) => {
        this.setState({
            searchTerm: event.target.value,
        })
    }

    onSearchSubmit = (event) => {
        const { searchTerm } = this.state;
        this.setState({ searchKey: searchTerm })

        if (this.needsToSearchTopstories(searchTerm)) {
            this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
        }
        event.preventDefault();
    }

    onDismiss = (id) => {
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];
        const updatedHits = hits.filter((item) => item.objectID !== id);

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        })
    }

    render() {
        const {
            results,
            searchKey,
            searchTerm,
            isLoading,
        } = this.state;

        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;

        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || []

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
                { results &&
                <Table
                    list={list}
                    onDismiss={this.onDismiss}
                />
                }
                <div className="interactions">
                    <ButtonWithLoading
                        onClick={() => this.fetchSearchTopstories(searchKey, page +1)}
                        isLoading={isLoading}
                    >
                        More Ziom{page}
                    </ButtonWithLoading>

                </div>
            </div>
        );
    }
}

const withLoading = (Component) => ({isLoading, ...rest}) => {
    console.log('isLoading', isLoading)
    return isLoading ? <Loading /> : <Component {...rest}/>
}


const Loading = () =>
    <div>Loading ...</div>

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

class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSortReverse: false,
            sortKey: 'NONE',
        }
    }

    onSort = (sortKey) => {
        const isSortReverse = sortKey === this.state.sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse });
    }

    render() {
        const {
            sortKey,
            isSortReverse
        } = this.state;
        const {
            list,
            onDismiss,
        } = this.props;
        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList
            : sortedList.reverse();

        return (
            <div className="table">
                <div className="table-header">
            <span style={{width: '40%'}}>
                <Sort
                    sortKey={'TITLE'}
                    onSort={this.onSort}
                    activeSortKey={sortKey}
                >
                    TITLE
                </Sort>
            </span>
                    <span style={{width: '30%'}}>
                <Sort
                    sortKey={'AUTHOR'}
                    onSort={this.onSort}
                    activeSortKey={sortKey}
                >
                    AUTHOR
                </Sort>
            </span>
                    <span style={{width: '10%'}}>
                <Sort
                    sortKey={'COMMENTS'}
                    onSort={this.onSort}
                    activeSortKey={sortKey}
                >
                    COMMENTS
                </Sort>
            </span>
                    <span style={{width: '10%'}}>
                <Sort
                    sortKey={'POINTS'}
                    onSort={this.onSort}
                    activeSortKey={sortKey}
                >
                    POINTS
                </Sort>
            </span>
                </div>

                {

                    reverseSortedList.map((item) => (
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
        )
    }
}



const Sort = ({ sortKey, onSort, activeSortKey, children }) => {

    const sortClass = ['button-inline'];

    if (sortKey === activeSortKey) {
        sortClass.push('button-active')
    }
    return (
        <Button
            onClick={() => onSort(sortKey)}
            className={ sortClass.join(' ') }
        >
            {children}
        </Button>
    )
}


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

const ButtonWithLoading = withLoading(Button);

export {PARAM_PAGE, PARAM_SEARCH};
export default App;
