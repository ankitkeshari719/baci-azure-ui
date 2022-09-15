import { FunctionComponent, useEffect, useState } from 'react';

import d3Cloud from 'd3-cloud';
import { interpolateWarm } from 'd3-scale-chromatic';

export interface Word {
  text: string;
  size: number;
}

export interface WordCloudProps {
  data: Word[];
}

const WordCloud: FunctionComponent<WordCloudProps> = ({ data }) => {
  let cloudWords: d3Cloud.Word[] = [];
  const [cloud, setCloud] = useState(cloudWords);
  useEffect(() => {
    d3Cloud()
      .size([500, 250])
      .timeInterval(20)
      .words(data)
      .font(({ text, size }, i) => ['Open Sans', 'Pacifico', 'impact'][i % 3])
      .fontSize(datum => {
        return datum.size ? datum.size * 10 : 0;
      })
      .padding(4)
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
                  fill: interpolateWarm(
                    word.size ? 0.0 + (word.size % 400) / 200 : 0
                  ),
                  backgroundColor: 'yellow',
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
