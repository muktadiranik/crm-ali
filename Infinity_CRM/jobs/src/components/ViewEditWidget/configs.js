import { getCookie } from "../KidModal";
import {
  TextWidget,
  NumberWidget,
  DateWidget,
  CheckboxWidget,
  SelectWidget,
} from "./CustomWidgets";

const WidgetEnum = {
  checkbox: "checkbox",
  date: "date",
  number: "number",
  select: "select",
  text: "text",
};

const SelectEndpointsEnum = {
  feeTypes: "/api/feeTypeList/",
  jobCycles: "/api/jobCycleList/",
  diciplines: "/api/DisciplinesList/",
  jobCycleStatus: "/api/jobStatusList/",
  jobStatuses: "/api/jobStatusList/",
  reviewers: "/api/ReviewersList/",
};

const createRequestData = (payload, method = "PUT") => ({
  method: method,
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
  },
  body: JSON.stringify(payload),
});

const widgets = {
  checkbox: CheckboxWidget,
  date: DateWidget,
  number: NumberWidget,
  select: SelectWidget,
  text: TextWidget,
};

export { WidgetEnum, SelectEndpointsEnum, createRequestData, widgets };
