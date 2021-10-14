import React from 'react';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './../index.css';

export class Analyst extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { profile, prop = 'analysts_yh', imgProp = 'analysts_yh_img', theme = 'light' } = this.props;
    const { copied } = this.state;
    if (!profile) {
      return (
        <div style={{ fontSize: 12 }}>Not available at this time... </div>
      );
    }
    if (profile[imgProp] && profile[imgProp].url) {
      const btnClass = copied ? 'react-components-show-url btn btn-sm btn-danger disabled font-12' : 'react-components-show-url btn btn-sm btn-warning font-12';
      const btnText = copied ? 'Copied' : 'Copy Img';
      return (
        <div className='react-components-show-button'>
          <img alt={`${profile.ticker} - ${profile.name} analyst opinions`} src={profile[imgProp].url} style={{ width: '100%' }} />
          <CopyToClipboard text={profile[imgProp].url || ''}
            onCopy={() => this.setState({ copied: true })}
          >
            <button className={btnClass} value={btnText}>{btnText}</button>
          </CopyToClipboard>
        </div>
      );
    }
    const info = profile[prop] || {};
    const recommendation = _.first(info.arr || []) || {};

    const data = {
      labels: [
        `Strong Buy (${recommendation.strongBuy})`,
        `Buy (${recommendation.buy})`,
        `Hold (${recommendation.hold})`,
        `Sell (${recommendation.sell})`,
        `Strong Sell (${recommendation.strongSell})`,
      ],
      datasets: [{
        data: [
          recommendation.strongBuy,
          recommendation.buy,
          recommendation.hold,
          recommendation.sell,
          recommendation.strongSell,
        ],
        backgroundColor: [
        'darkgreen',
        'green',
        'gold',
        'orange',
        'red'
        ],
      }]
    };  

    const fontColor = theme === 'light' ? '#222222' : '#dddddd';
    const options = {
      legend: {
        position: 'left',
        display: true,
        labels: {
          fontColor,
          fontSize: 12
        }
      }
    };

    return (
      <div style={{ width: '100%', padding: 5, fontSize: 12 }}>
        <div className={`theme-darkred-${theme}`} style={{ fontWeight: 'bold' }}>{profile.ticker} - {profile.name}&nbsp;<span className={`theme-green-${theme}`}>Analyst Opinions</span></div>
        {info.targetHighPrice ? <div>Target high:&nbsp;<b className={`theme-green-${theme}`}>{info.targetHighPrice}&nbsp;</b>{info.currency}</div> : null}
        {info.targetLowPrice ? <div>Target low:&nbsp;<b className={`theme-green-${theme}`}>{info.targetLowPrice}&nbsp;</b>{info.currency}</div> : null}
        {info.targetMeanPrice && info.numberOfAnalystOpinions
          ? <div>
            Average:&nbsp;<b className={`theme-green-${theme}`}>{info.targetMeanPrice}</b>&nbsp;{info.currency}
                &nbsp;based on <b className={`theme-green-${theme}`}>{info.numberOfAnalystOpinions}</b> analysts as of {info.last_crawled.slice(0, 10)}
          </div>
          : null}
        <br />
        <div style={{ width: '100%' }}>
          {recommendation ? <div>
            <Doughnut height={120} data={data} options={options} />
          </div> : null}
        </div>
        <div style={{ fontSize: 12, padding: 5, paddingTop: 2 }}>Crafted by <a href='https://twitter.com/tradeideashq' target='_blank' className={`theme-darkred-${theme}`}>@tradeideashq</a> with <span style={{ fontSize: 16, color: 'red' }}>❤️</span></div>
      </div>
    );
  }
}

export default Analyst;
