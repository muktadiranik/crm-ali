import React, { useEffect, useState } from "react";
import { createRequestData, widgets } from "./configs";

const ViewEditWidget = ({
  widget,
  fieldName,
  value,
  labelValue,
  apiURL,
  fetchSampleData,
  optionsURL,
  editMode,
}) => {
  const [isEditMode, setEditMode] = useState(editMode || false);
  const [widgetValue, setValue] = useState(value);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!optionsURL) return;
    fetch(optionsURL)
      .then((response) => response.json())
      .then((response) => setOptions(response));
  }, [optionsURL]);

  const updateData = () => {
    const payload = {};
    payload[fieldName] = !widgetValue ? widget === 'date' ? null : "" : widgetValue;

    const requestData = createRequestData(payload);
    fetch(apiURL, requestData)
      .then(() => fetchSampleData())
      .then(() => {
        if (!editMode) setEditMode(false);
      });
  };

  return isEditMode ? (
    widgets[widget]({ widgetValue, setValue, updateData, options })
  ) : ( value ? <span onClick={() => setEditMode(true)}>{labelValue || value}</span> : <div onClick={() => setEditMode(true)} style={{color: 'transparent'}}>empty data</div>
  );
};

export default ViewEditWidget;
