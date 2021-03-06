import React from 'react';
import {Column, Control, Tag} from 'rbx';

const MoviePrices = props => (
  <Column.Group multiline centered breakpoint="mobile">
    <Column narrow>
      <Control>
        <Tag.Group gapless>
          <Tag color={props.ticketPrice === 0 ? 'info' : 'warning'} className="has-text-weight-bold has-text-black">{props.ticketPrice === 0 ? 'FREE' : `$${props.ticketPrice}`}</Tag>
          <Tag color="black">tickets</Tag>
        </Tag.Group>
      </Control>
    </Column>
    <Column narrow>
      <Control>
        <Tag.Group gapless>
          <Tag color="warning" className="has-text-weight-bold has-text-black">${props.concessionPrice}</Tag>
          <Tag color="black">concessions</Tag>
        </Tag.Group>
      </Control>
    </Column>
  </Column.Group>
);

export default MoviePrices;
