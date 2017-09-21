import React from 'react';
import { Alert, Card, Form, Icon, Input, Select, Tabs, Button } from 'antd';
import firebase from './fire';
import './index.css';

const TabPane = Tabs.TabPane;
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

class Header extends React.Component {
  render() {
    return <h1>Charlie's Kitty Cafe</h1>
  }
}

class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      buttonMessage: 'Sign In'
    }
  }

  handleSignInOrOut() {
    console.log("INSIDE handleSignInOrOut")
    if (this.state.user === '') { //user signed out
      this.signInWithGoogle()
    }
    else {
      this.signOutWithGoogle()
    }
  }

  signInWithGoogle() {
    var that = this
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log("USER LOGGED IN AS: " + user.displayName)
      that.setState({
        user: user.displayName,
        buttonMessage: 'Sign Out'
      })
      console.log(that.state.user)
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  }

  signOutWithGoogle() {
    var that = this
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      that.setState({
        user: '',
        buttonMessage: 'Sign In'
      })
      }).catch(function(error) {
        console.log("ERROR SIGNING OUT!")
    });
  }

  render() {
    console.log(this.state.user)

    return (
      <div>
        <Button type="primary" onClick={this.handleSignInOrOut.bind(this)}>{this.state.buttonMessage}</Button>
        <ProductTable products={this.props.products} user={this.state.user} />
      </div>
    );
  }
}

const gridStyle = {
  width: '25%',
  textAlign: 'center',
  cursor: 'pointer',
};

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#FFFFFF'
    }
  }

  addRecord(e) {
    this.makeModalHidden(this.props)
    if (this.user === '') {
      var message = "Please sign in!"
      console.log(message)
      this.makeModalVisible(message)
    }
    else if (!this.product.stocked) {
      var message = "This item is out of stock! Please choose something else."
      console.log(message)
      this.makeModalVisible(message)
    }
    else {
      console.log(this)
      db.collection("orders").add({
        name: this.product.name,
        price: this.product.price,
        user: this.user,
        time: Date.now(),
        fulfilled: false
      })
      .then(function(docRef) {
        console.log("Document with ID " + docRef.id + " successfully written")
      })
      .catch(function(error) {
        console.error("Error writing document: " + error);
      });
    }
  }

  render() {
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color: 'red'}}>
        {this.props.product.name} (out of stock)
      </span>;
    return (
      <div>
        <Card.Grid onClick={this.addRecord.bind(this.props)} style={gridStyle} >
          <p>{name}</p>
          <p>{this.props.product.price}</p>
        </Card.Grid>
      </div>
      );
  }
}

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      message: '    '
    }
  }

  makeModalVisible(message) {
    this.setState({
      modalVisible: true,
      message: message
    })
  }

  makeModalHidden() {
    this.setState({
      modalVisible: false,
      message: '    '
    })
  }

  render() {
    var rows = [];
    this.props.products.forEach((product) => {
      rows.push(<ProductCard 
        product={product} 
        key={product.name}
        user={this.props.user}
        makeModalVisible={this.makeModalVisible.bind(this)}
        makeModalHidden={this.makeModalHidden.bind(this)} />);
    });
    if (this.state.modalVisible) {
      return (
        <div>
          <Alert message={this.state.message}
                type="error"
                closable={true}
                onClose={this.makeModalHidden.bind(this)}
                showIcon/>
          <Card title="Yummy Goodies" style={ {background: '#FFFFFF', padding: '10px'} }>
            {rows}
          </Card>
        </div>
        )
    }
    else {
      return (
        <Card title="Yummy Goodies" style={ {background: '#FFFFFF', padding: '10px'} }>
          {rows}
        </Card>
        );
    }
  }
}

class OrderCard extends React.Component {
  removeOrder() {
    var currentOrders = this.props.allOrders;
    var that = this;
    var updatedOrders = currentOrders.filter(function(e) {
      return e.id !== that.props.orderId;
    })
    this.props.update(updatedOrders)
  }

  deleteRecord() {
    var docId = this.props.orderId
    db.collection("orders").doc(docId).delete()
      .then(function() {
        console.log("Successfully deleted document id " + docId)
      })
      .catch(function(error) {
        console.error("Error writing document: " + error);
      });
  }

  render() {
    return (
      <Card.Grid onClick={this.deleteRecord.bind(this)} style={gridStyle} >
        <p>ORDER FOR: {this.props.order.user}</p>
        <p>{this.props.order.price}</p>
        <p>{this.props.order.name}</p>
      </Card.Grid>
    );
  }
}

class UpdateOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sum: 0
    }
  }

  callback(key) {
    console.log(key)
  }

  render() {
    var customerRows = [];
    for (var key in this.props.orders) {
      // console.log(key)
      customerRows.push(<TabPane tab={key} key={key}>
        <CustomerRow
          user={key}
          orders={this.props.orders[key]}
          key={key}
          update={this.props.updateOrdersState.bind(this)}
          allOrders={this.orders}/>
        </TabPane>
      )
    }
    // console.log(customerRows)
    return (
      <Tabs type="card">
        {customerRows}
      </Tabs>
    )
  }
}

class SumCard extends React.Component {
  render() {
    return (
      <Card title="RUNNING TOTAL" style={{cursor: 'pointer'}} onClick={this.props.updateSum}>
        <p>{this.props.sum}</p>
    </Card>)
  }
}

class CustomerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sum: 0
    }
  }

  updateSum(newSum) {
    this.setState({
      sum: newSum
    })
  }

  render() {
    var title = "Recent orders for " + this.props.user
    var user = this.props.user
    var newSum = 0
    for (var i in this.props.orders) {
      var price = this.props.orders[i].data().price
      // console.log(price)
      newSum += price
      // console.log(newSum)
    }

    var orderCards = this.props.orders.map((o, index) => <OrderCard 
              order={o.data()}
              key={o.id}
              update={this.updateOrdersState}
              orderId={o.id}
              allOrders={this.props.orders}/>)
    // console.log(orderCards)
    return (
      <div>
        <SumCard updateSum={this.updateSum.bind(this)} sum={newSum} />
        <Card title="ORDERS">
          {orderCards}
        </Card>
      </div>)
  }
}

export default class App extends React.Component {
  state = {
    activeOrders: []
  }

  componentDidMount() {
    var that = this;
    db.collection('orders').orderBy('user')
      .onSnapshot(function(querySnapshot) {
        // console.log(querySnapshot)
        var orders = {};
        querySnapshot.forEach(function(doc) {
            var curUser = doc.data().user;
            // console.log(doc.data().user)
            if (orders[curUser] === undefined) {
              orders[curUser] = [];
            }           
            orders[curUser].push(doc);
        });
        that.setState({
          activeOrders: orders
        });
      });
  }

  updateOrdersState(updatedOrders) {
    console.log(this)
    this.setState({
      activeOrders: [
        ...updatedOrders
      ]
    })
    console.log(this.state.activeOrders)
  }

  render() {
    return (
      <div>
        <Header />
        <UserSelect products={this.props.products} />
        <UpdateOrders 
          updateOrdersState={this.updateOrdersState.bind(this)}
          orders={this.state.activeOrders} />
      </div>
    )
  }
}