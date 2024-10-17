import { Select, TextField, MenuItem, Checkbox } from "@material-ui/core";

const TextWidget = ({ widgetValue, setValue, updateData }) => {
  return (
    <TextField
      className="w-100"
      type="text"
      value={widgetValue}
      onBlur={updateData}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const NumberWidget = ({ widgetValue, setValue, updateData }) => {
  return (
    <TextField
      className="w-100"
      type="number"
      step="1"
      value={widgetValue}
      onBlur={updateData}
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const DateWidget = ({ widgetValue, setValue, updateData }) => {
  return (
    <TextField
      className="w-100"
      type="date"
      value={widgetValue}
      onBlur={updateData}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const CheckboxWidget = ({ widgetValue, setValue, updateData }) => {
  return (
    <Checkbox
      type="checkbox"
      color="default"
      checked={widgetValue}
      onBlur={updateData}
      onChange={(e) => setValue(!widgetValue)}
    />
  );
};

const SelectWidget = ({ widgetValue, setValue, updateData, options }) => {
  return (
    <Select
      className="w-100"
      value={widgetValue}
      onChange={(e) => setValue(e.target.value)}
      onBlur={updateData}
    >
      {options.map(({ id, name: value }) => (
        <MenuItem key={id} value={id}>
          {value}
        </MenuItem>
      ))}
    </Select>
  );
};

export { TextWidget, NumberWidget, DateWidget, CheckboxWidget, SelectWidget };
