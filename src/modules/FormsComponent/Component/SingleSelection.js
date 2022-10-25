/* eslint-disable radix */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Alert} from 'react-native';
import {
  RadioGroup,
  RadioButton,
} from '../../../components/external/RadioButton';
import {styless} from '../../../components/common/Styles';

export const SingleSelection = ({
  item,
  theme,
  onRadioSelection,
  selectedValue,
}) => {
  const [index, setIndex] = React.useState(0);

  const onSelection = (index, value) => {
    // Alert.alert('selected index - fsdf', index.toString());
    onRadioSelection(item.name, value, item.option[parseInt(value)]);
    setIndex(index);
  };

  const options = [JSON.parse(JSON.stringify(item.option))];

  const selectedIndex = parseInt(parseInt(selectedValue) - 1);
  let lable = '';

  if (item.rules !== undefined && item.rules.includes('required')) {
    lable = item.lable + '*';
  } else {
    lable = item.lable;
  }

  return (
    <View>
      <Text style={[theme.detail, {color: 'gray', fontSize: 16}]}>
        {' '}
        {lable}{' '}
      </Text>

      <RadioGroup
        size={28}
        thickness={2}
        color={theme.$greenColor}
        selectedIndex={selectedIndex} //parseInt(item.position)
        onSelect={onSelection}>
        {item.option !== undefined &&
          Object.values(item.option).map((key, value) => (
            <RadioButton value={value + 1} buttonOnRight={true}>
              <Text style={theme.detailLarge}>{key}</Text>
            </RadioButton>
          ))}
      </RadioGroup>
    </View>
  );
};
