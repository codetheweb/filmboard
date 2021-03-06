import React from 'react';
import fetch from 'isomorphic-unfetch';
import {Title, Section, Container} from 'rbx';
import Router from 'next/router';
import PageEditor from '../../../components/page-editor';
import {getBaseURL} from '../../../common/helpers';
import {withAuthSync, fetchWithAuth} from '../../../components/lib/auth';

class EditPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  static async getInitialProps(ctx) {
    const [props, categories] = await Promise.all([
      ((await fetch(`${getBaseURL(ctx)}/api/pages/${ctx.query.name}`)).json()),
      ((await fetch(`${getBaseURL(ctx)}/api/pages/categories`)).json())
    ]);

    return {
      ...props,
      categories
    };
  }

  async handleSubmit(event, state) {
    event.preventDefault();

    const page = await fetchWithAuth(`/api/pages/${this.props.name}`, {
      method: 'put',
      body: state
    });

    Router.push(`/pages/${page.name}`);
  }

  async handleDelete() {
    if (!confirm('Are you sure you want to delete this?')) {
      return;
    }

    await fetchWithAuth(`/api/pages/${this.props.name}`, {
      method: 'delete'
    });

    Router.push('/');
  }

  render() {
    return (
      <div>
        <Section>
          <Container>
            <Title>Edit Page</Title>
            <PageEditor name={this.props.name} content={this.props.content} categories={this.props.categories} category={this.props.PageCategoryId ? this.props.PageCategory.name : 'None'} onSubmit={this.handleSubmit} onDelete={this.handleDelete}/>
          </Container>
        </Section>
      </div>
    );
  }
}
export default withAuthSync(EditPage);
