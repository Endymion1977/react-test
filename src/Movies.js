import React, { Component } from 'react';
import { Header, Message, Table } from 'semantic-ui-react';
import { withAuth } from '@okta/okta-react';

import { API_BASE_URL } from './config'
import MovieForm from './MovieForm';

export default withAuth(class Movies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: null,
            isLoading: null
        };
        this.onAddition = this.onAddition.bind(this);
    }

    componentDidMount() {
        this.getMovies();
    }

    async getMovies() {
        if (!this.state.movies) {
            try {
                this.setState({ isLoading: true });
                const accessToken = await this.props.auth.getAccessToken();
                const response = await fetch(API_BASE_URL + '/movies', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                this.setState({ movies: data, isLoading: false});
            } catch (err) {
                this.setState({ isLoading: false });
                console.error(err);
            }
        }
    }

    onAddition(movie) {
        this.setState({
            movies: [...this.state.movies, movie]
        })
    }

    render() {
        return (
            <div>
                <Header as="h1">My Movies</Header>
                {this.state.isLoading && <Message info header="Loading movies..." />}
                {this.state.movies &&
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Bad Puns Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.movies.map(
                                    movie => 
                                        <tr id={movie.id} key={movie.id}>
                                            <td>{movie.id}</td>
                                            <td>{movie.title}</td>
                                            <td>{movie.count}</td>
                                            <td>actions</td>
                                        </tr>
                            )}
                            </tbody>
                        </Table>
                        <MovieForm onAddition={this.onAddition} />
                    </div>
                }
            </div>
        );
    }
});