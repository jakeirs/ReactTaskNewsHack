import React, {Component, PropTypes} from 'react';
// import Div from './Div';
import './App.css';
<<<<<<< HEAD
import { sortBy } from 'lodash';
=======
import {sortBy} from 'lodash';
>>>>>>> 8917a0f7a09fa5353581d0f4f866f749121f147b

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


const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
};


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
<<<<<<< HEAD

        this.setState(updateSearchTopstoriesState(hits, page));
=======
        const {searchKey, results} = this.state;

        const oldHits = results && results[searchKey]
            ? results[searchKey].hits
            : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ];
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            },
            isLoading: false
        })
>>>>>>> 8917a0f7a09fa5353581d0f4f866f749121f147b
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
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm})
        this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    onSearchChange = (event) => {
        this.setState({
            searchTerm: event.target.value,
        })
    }

    onSearchSubmit = (event) => {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm})

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
                [searchKey]: {hits: updatedHits, page}
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
                        onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
                        isLoading={isLoading}
                    >
                        More Ziom{page}
                    </ButtonWithLoading>
<<<<<<< HEAD

=======
>>>>>>> 8917a0f7a09fa5353581d0f4f866f749121f147b
                </div>
            </div>
        );
    }
}

const withLoading = (Component) => ({isLoading, ...rest}) => {
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
<<<<<<< HEAD

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

=======

        this.state = {
            sortKey: 'NONE',
            isSortReverse: false,
        };
    }

    onSort = (sortKey) => {
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse });
    }

    render() {
        const {
            list,
            onDismiss,
        } = this.props;

        const {
            sortKey,
            isSortReverse,
        } = this.state;
        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList.reverse()
            : sortedList;

        return (
            <div className="table">
                <div className="table-header">
          <span style={{width: '40%'}}>
            <Sort
                sortKey={'TITLE'}
                onSort={this.onSort}
                activeSortKey={sortKey}
            >
              Title
            </Sort>
          </span>
                    <span style={{width: '30%'}}>
            <Sort
                sortKey={'AUTHOR'}
                onSort={this.onSort}
                activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
                    <span style={{width: '10%'}}>
            <Sort
                sortKey={'COMMENTS'}
                onSort={this.onSort}
                activeSortKey={sortKey}
            >
              Comments
            </Sort>
          </span>
                    <span style={{width: '10%'}}>
            <Sort
                sortKey={'POINTS'}
                onSort={this.onSort}
                activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
                    <span style={{width: '10%'}}>
            Archive
          </span>
                </div>
                {
>>>>>>> 8917a0f7a09fa5353581d0f4f866f749121f147b
                    reverseSortedList.map((item) => (
                        <div key={item.objectID}
                             className="table-row"
                        >
<<<<<<< HEAD
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
=======
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
>>>>>>> 8917a0f7a09fa5353581d0f4f866f749121f147b
                        </div>
                    ))
                }
            </div>
        )
    }
}


<<<<<<< HEAD

const Sort = ({ sortKey, onSort, activeSortKey, children }) => {

    const sortClass = ['button-inline'];

    if (sortKey === activeSortKey) {
        sortClass.push('button-active')
    }
    return (
        <Button
            onClick={() => onSort(sortKey)}
            className={ sortClass.join(' ') }
=======
const Sort = ({sortKey, activeSortKey, onSort, children}) => {
    const sortClass = ['button-inline'];

    if (sortKey === activeSortKey ) {
        sortClass.push('button-active');
    }

    return (
        <Button
            onClick={() => onSort(sortKey)}
            className={sortClass.join(' ')}
>>>>>>> 8917a0f7a09fa5353581d0f4f866f749121f147b
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
