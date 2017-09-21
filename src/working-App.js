import React from 'react';
import { Alert, Card, Select } from 'antd';
import db from './fire';
import './index.css';

class Header extends React.Component {
  render() {
    return <h1>Charlie's Kitty Cafe</h1>
  }
}

class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ''
    }
  }

  render() {
    var that = this;
    const Option = Select.Option;
    function handleChange(value) {
      console.log(`selected ${value}`);
      that.setState({
        user: value
      })
    }

    function handleBlur() {
      // console.log('blur');
    }

    function handleFocus() {
      // console.log('focus');
    }

    return (
      <div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          <Option value="Diana">Diana</Option>
          <Option value="Arthur">Arthur</Option>
          <Option value="Charlie">Charlie</Option>
        </Select>
        <ProductTable products={this.props.products} user={this.state.user} />
      </div>
    );
  }
}

const gridStyle = {
  width: '25%',
  textAlign: 'center',
  cursor: 'pointer',
  // backgroundColor:'#EFEFEF'
};

// class OrderCardParent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       popupHidden: true
//     }
//   }

//   render() {
//     if (!this.product.stocked) {
//       return <Alert message="Item out of stock!" type="error" showIcon/>
//     }
//     else if (this.user === '') {
//       return <Alert message="Please select user!" type="error" showIcon/>
//     }
//     // else {
//     //   return 
//     // }
//   }
// }

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
      var message = "Please select user!"
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
        user: this.user
      })
      .then(function(docRef) {
        // console.log("Document with ID " + docRef.id + " successfully written: " + this.name + ", " + this.price)
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

class OrderRow extends React.Component {
  removeOrder() {
    // var orderId = this.props.order.id;
    // document.getElementById('OrderRow').style.backgroundColor = 'grey';
    // console.log(this)
    var currentOrders = this.props.allOrders;
    // console.log(currentOrders)
    var that = this;
    var updatedOrders = currentOrders.filter(function(e) {
      // console.log(e.id + "!==" + that.props.orderId)
      return e.id !== that.props.orderId;
    })
    // console.log(updatedOrders)
    this.props.update(updatedOrders)
  }

  render() {
    // console.log(this.removeOrder);
    return (
      <Card.Grid style={gridStyle} onClick={this.removeOrder.bind(this)}>
        <p>ORDER FOR: {this.props.order.user}</p>
        <p>{this.props.order.price}</p>
        <p>{this.props.order.name}</p>
      </Card.Grid>
    );
  }
}

class UpdateOrders extends React.Component {
  render() {
    var orders = [];
    var that = this.props;
    this.props.orders.forEach((order) => {
      // console.log(that.removeOrder)
      orders.push(<OrderRow 
        order={order.data()}
        key={order.id}
        update={that.updateOrdersState}
        orderId={order.id}
        allOrders={that.orders}/>)
    });
    return (
      <Card title="Recent Orders" style={ {padding: '10px'} }>
        {orders}
      </Card>
    )
  }
}

export default class App extends React.Component {
  state = {
    activeOrders: [],
    moneyOwed: []
  }

  componentDidMount() {
    // console.log(this)
    var that = this;
    db.collection('orders').orderBy('user')
      .onSnapshot(function(querySnapshot) {
        console.log(querySnapshot)
        var orders = [];
        querySnapshot.forEach(function(doc) {
            // console.log(doc.id);
            // if (doc.data().name )
            orders.push(doc);
        });// console.log(doc)
        that.setState({
          activeOrders: [
            ...orders
          ]
        });
        console.log(that.state)
      });
  }

  updateOrdersState(updatedOrders) {
    console.log(this)
    this.setState({
      activeOrders: [
        ...updatedOrders
      ]
    })
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