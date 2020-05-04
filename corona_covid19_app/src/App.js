import React from "react";

import { Cards, Chart, CoutryPicker } from "./components";
import styles from "./App.module.css";
import { fetchData } from "./api";

import coronaImage from "./images/image.png";
class App extends React.Component {
  state = {
    data: {},
    country: "",
  };

  async componentDidMount() {
    // const fetchedData = await fetchData();
    // this.setState({ data: fetchedData });
    // //console.log(fetchedData);
    this.setAppState();
  }

  handleCountryChange = async (country) => {
    this.setAppState(country);
    // const fetchedData = await fetchData(country);

    // this.setState({ data: fetchedData, country: country });

    // console.log(country);
    //fetch the data
    //set the date
  };

  setAppState = async (country) => {
    let fetchedData;

    if (country) fetchedData = await fetchData(country);
    else fetchedData = await fetchData();

    this.setState({ data: fetchedData, country: country });
  };
  render() {
    const { data, country } = this.state;
    return (
      <div className={styles.container}>
        <img src={coronaImage} className={styles.image} alt="COVID 19" />
        <span className={styles.ss_promotion_disclaimer}>
          All Data read from ==> https://covid19.mathdro.id/api
        </span>
        <Cards data={data} />
        <CoutryPicker handleCountryChange={this.handleCountryChange} />
        <Chart data={data} country={country} />
      </div>
    );
  }
}

export default App;
