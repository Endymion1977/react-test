import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Header, Message, Table } from 'semantic-ui-react';

export default withAuth(class Movies extends Component {

    constructor(props) {
        super(props);
        this.API_BASE_URL = 'http://localhost:8000';
        this.state = { movies: null, loading: null };
    }

    componentDidMount() {
        this.getMovies();
    }

    async getMovies() {
        if (!this.state.movies) {
            try {
                this.setState({ loading: true });
                const accessToken = await this.props.auth.getAccessToken();
                const response = await fetch(this.API_BASE_URL + '/movies', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const data = await response.json();
                this.setState({ movies: data, loading: false});
            } catch (err) {
                this.setState({ loading: false });
                console.error(err);
            }
        }
    }

    render() {
        return (
            <div>
                <Header as="h1">My Movies</Header>
                {this.state.loading === true && <Message info header="Loading movies..." />}
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
                    </div>
                }
            </div>
        );
    }
});