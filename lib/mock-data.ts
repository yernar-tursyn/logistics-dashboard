import type { LogisticsData } from "@/types";

export const mockData: LogisticsData = {
  demand: {
    rows: [
      {
        id: "№82 от 18.09.2024",
        status: "обеспечен 3 из 10",
        note: "",
        wagonNumber: "",
      },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "111111" },
      {
        id: "любой",
        status: "обеспечен с корректировкой",
        note: "",
        wagonNumber: "222222",
      },
      {
        id: "любой",
        status: "обеспечен, с корректировкой по ограничениям",
        note: "",
        wagonNumber: "333333",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "1234, 33",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "1234, 33",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "1234, 33",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "1234, 33",
        wagonNumber: "",
      },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "44444" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "1234, 33",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "1234, 33",
        wagonNumber: "",
      },
    ],
  },
  optimizerPlan: {
    rows: [
      {
        id: "№82 от 18.09.2024",
        status: "обеспечен",
        note: "",
        wagonNumber: "111111",
      },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "222222" },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "333333" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "44444" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
    ],
  },
  projectPlan: {
    rows: [
      {
        id: "№82 от 18.09.2024",
        status: "выгрузка +3, плановая",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "выгрузка +3",
        note: "принят",
        wagonNumber: "22222",
      },
      {
        id: "любой",
        status: "выгрузка +3",
        note: "принят",
        wagonNumber: "33333",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
    ],
  },
  approvedPlan: {
    rows: [
      {
        id: "№82 от 18.09.2024",
        status: "ПОЗЖЕ",
        note: "",
        wagonNumber: "3423423",
      },
      { id: "любой", status: "РАВНО", note: "", wagonNumber: "3434345" },
      { id: "любой", status: "РАНЬШЕ", note: "", wagonNumber: "2342344" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
    ],
  },
  execution: {
    rows: [
      {
        id: "№82 от 18.09.2024",
        status: "ПОЗЖЕ",
        note: "",
        wagonNumber: "3423423",
      },
      { id: "любой", status: "РАВНО", note: "", wagonNumber: "3434345" },
      { id: "любой", status: "РАВНО", note: "", wagonNumber: "2342344" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      { id: "любой", status: "обеспечен", note: "", wagonNumber: "" },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
      {
        id: "любой",
        status: "не обеспечен, по ограничениям",
        note: "",
        wagonNumber: "",
      },
    ],
  },
};
