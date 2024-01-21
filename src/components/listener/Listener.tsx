import { useEffect, useState } from "react";
import "./listener.scss";
import React from "react";

type CacheArray = Array<{ size: number; level: number; cache_type: String }>;

interface Msr {
  voltage: number;
  package_power: number;
  vendor: String;
  name: String;
  util: number;
  threads: number;
  cores: number;
  temperature: number;
  per_core_freq: Array<number>;
  mem_total: number;
  mem_free: number;
  mem_used: number;
  cache: CacheArray;
}

const default_msr: Msr = {
  voltage: 0,
  package_power: 0,
  vendor: "",
  name: "",
  util: 0,
  threads: 0,
  cores: 0,
  temperature: 0,
  per_core_freq: [],
  mem_total: 0,
  mem_free: 0,
  mem_used: 0,
  cache: [],
};

export default class Listener extends React.Component<{}, { req: Msr }> {
  constructor(props: any) {
    super(props);
    this.state = {
      req: default_msr,
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((res) => this.setState({ req: res }))
      .catch((err) => console.log(err));
  }

  componentDidUpdate(): void {
    setTimeout(() => {
      fetch("http://localhost:8000/")
        .then((res) => res.json())
        .then((res) => this.setState({ req: res }))
        .catch((err) => console.log(err));
    }, 5000);
  }

  Cache(props: { arr: CacheArray }) {
    return (
      <div className="cache">
        {props.arr.map((value, key) => {
          return (
            <div key={key} className="cacheRow">
              <p className="cacheName">
                Cache level {value.level} {value.cache_type}:
              </p>
              <p>{value.size / 1024} kb</p>
            </div>
          );
        })}
      </div>
    );
  }

  render(): React.ReactNode {
    let req = this.state.req;
    console.log(this.state.req.package_power);
    return (
      <div className="listener">
        <h1> Source: localhost:8000</h1>
        <h2>{req.name}</h2>
        <div className="coreInfo">
          <div className="coresThreads">
            <p>Cores: {req.cores}</p>
            <p>Threads: {req.threads}</p>
          </div>
          <this.Cache arr={req.cache}></this.Cache>
        </div>
      </div>
    );
  }
}
