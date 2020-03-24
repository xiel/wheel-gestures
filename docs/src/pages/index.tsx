import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import SimpleWheelDrag from '../components/SimpleWheelDrag/SimpleWheelDrag'
import CodeArea from '../components/CodeArea/CodeArea'

// eslint-disable-next-line react-app/import/no-webpack-loader-syntax
import CodeAreaCode from '!!raw-loader!../components/CodeArea/CodeArea'

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Add wheel gestures to your web app</h1>
    <p>Allow users to interact with your website like on a touch device</p>
    <h3>Installation</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus accusantium adipisci, debitis enim est facere
      illo ipsa maiores mollitia neque nisi non nostrum placeat possimus recusandae, sequi soluta, sunt vero!
    </p>
    <CodeArea>{CodeAreaCode}</CodeArea>
    <CodeArea>{`
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
    `}</CodeArea>
    <h3>Example</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus beatae debitis dicta dolor fuga labore
      necessitatibus, nemo nesciunt nihil odio perspiciatis, quasi qui quia repudiandae tempore unde ut vitae
      voluptatem!
    </p>
    <SimpleWheelDrag />
    <Link to="/gallery/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
