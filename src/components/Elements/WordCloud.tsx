import { FunctionComponent, useEffect, useState } from 'react';

import d3Cloud from 'd3-cloud';
import { interpolateWarm, interpolateGreens } from 'd3-scale-chromatic';

export interface Word {
  text: string;
  size: number;
}

export interface WordCloudProps {
  data: Word[];
  showOn: string;
}

const WordCloud: FunctionComponent<WordCloudProps> = ({ data, showOn }) => {
  let cloudWords: d3Cloud.Word[] = [];
  const [cloud, setCloud] = useState(cloudWords);
  let colorsGreen = ['#48706A', '#8AC269', '#5D965B', '#467E59', '#C9E092'];
  let colorOrange = ['#73503C', '#D9A86C', '#591C16', '#D9C0A3', '#BF9169'];
  let colorBlue = [
    '#EBF8FF',
    '#D6F1FF',
    '#C2EBFF',
    '#ADE4FF',
    '#99DDFF',
    '#7CCBF3',
    '#57BDEF',
    '#44B5EE',
    '#32AEEC',
    '#1FA6EA',
    '#159ADD',
    '#3F87CA',
    '#357DC0',
    '#3072B0',
    '#2C69A1',
    '#275E90',
    '#1e9967',
    '#1AAF58',
    '#18bf4d',
    '#17C54A',
    '#16CA46',
    '#18DC4D',
  ];

  useEffect(() => {
    d3Cloud()
      .size([500, 250])
      .timeInterval(20)
      .words(data)
      .font(({ text, size }, i) => ['Poppins', 'Poppins', 'Poppins'][i % 3])
      .fontSize(datum => {
        return datum.size
          ? datum.size < 15
            ? 32
            : datum.size < 30
            ? 24
            : datum.size < 45
            ? 16
            : 8
          : 16;
      })
      .padding(10)
      .rotate(() => 0)
      .text(datum => {
        return datum.text ?? '';
      })
      .on('end', words => setCloud(words))
      .start();
  }, [data]);

  return (
    <svg viewBox="0 0 500 250" width={'100%'} height={'100%'}>
      <g transform={`translate(${250},${125})`}>
        {cloud &&
          cloud.map(word => {
            return (
              <text
                key={word.text}
                style={{
                  fontSize: word.size + 'px',
                  fontFamily: word.font,
                  fill:
                    showOn === 'whatWentWell'
                      ? colorsGreen[
                          Math.floor(Math.random() * colorsGreen.length)
                        ]
                      : showOn === 'whatDidntWentWell'
                      ? colorOrange[
                          Math.floor(Math.random() * colorOrange.length)
                        ]
                      : colorBlue[Math.floor(Math.random() * colorBlue.length)],
                  backgroundColor: 'yellow',
                  top: '5px',
                  right: '5px',
                  bottom: '5px',
                  left: '5px',
                }}
                textAnchor="middle"
                transform={`translate(${word.x},${word.y}) rotate(${word.rotate})`}
              >
                {word.text}
              </text>
            );
          })}
      </g>
    </svg>
  );
};

export default WordCloud;
