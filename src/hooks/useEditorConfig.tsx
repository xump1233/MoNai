import type { IBasicComponent, IComponentUnit } from "@/interface";

import PreviewBox from "@/components/PreviewBox";
import PropsEditBox from "@/components/PropsEditBox";
import BasicText from "@/components/BasicComponents/BasicText";
import BasicButton from "@/components/BasicComponents/BasicButton";
import BasicImage from "@/components/BasicComponents/BasicImage";
import BasicVideo from "@/components/BasicComponents/BasicVideo";
import LineChart from "@/components/BasicCharts/LineChart";

import {
  NButton,
  NInput,
  NInputNumber,
  NSelect,
  NCheckbox,
  NSwitch,
} from "naive-ui";

import usePageData from "./usePageData";

const { setPropsById } = usePageData();

function setProps(unit: IComponentUnit, key: string, value: any) {
  if (unit.props) {
    unit.props[key] = value;
  } else {
    unit.props = {
      key: value,
    };
  }
}

function createEditorConfig() {
  const componentList: IBasicComponent[] = [];
  const componentMap: Record<string, IBasicComponent> = {};

  return {
    componentList,
    componentMap,
    register: (component: IBasicComponent) => {
      componentMap[component.name] = component;
      if (component.name === "temporary") return;
      componentList.push(component);
    },
  };
}

export const registerConfig = createEditorConfig();

registerConfig.register({
  label: "文本",
  type: "form",
  name: "text",
  defaultWidth: 56,
  defaultHeight: 22,
  preview: () => (
    <PreviewBox>
      <div>文本</div>
    </PreviewBox>
  ),
  render: (props) => {
    return <BasicText {...props} />;
  },
  contextProps: [
    {
      name: "value",
      description: "文本内容",
    },
    {
      name: "fontSize",
      description: "文本大小",
    },
    {
      name: "color",
      description: "文本颜色",
    },
  ],
  editProps: (props: { unit: IComponentUnit }) => {
    return (
      <PropsEditBox>
        <div class="props-item">
          <div class="props-item-label">控件名：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"默认名为:" + props.unit.id}
              value={props.unit?.alias || ""}
              onUpdate:value={(value: string) => {
                props.unit.alias = value;
                // setPropsById(unit.id,{value:value});
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">默认文本：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"请输入文本内容"}
              type="textarea"
              value={props.unit.props?.value || ""}
              onUpdate:value={(value: string) => {
                if (props.unit.props) {
                  props.unit.props.value = value;
                } else {
                  props.unit.props = {
                    value: value,
                  };
                }
                // setPropsById(unit.id,{value:value});
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">字体大小：</div>
          <div class="props-item-content">
            <NInputNumber
              placeholder="字体大小"
              value={props.unit.props?.fontSize || ""}
              onUpdate:value={(value: number | null) => {
                if (value) {
                  setPropsById(props.unit.id, { fontSize: value });
                }
              }}
            ></NInputNumber>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">字体颜色：</div>
          <div class="props-item-content">
            <input
              type="color"
              value={props.unit.props?.color || "#000000"}
              onInput={(e: Event) => {
                setPropsById(props.unit.id, {
                  color: (e.target as HTMLInputElement).value,
                });
              }}
            ></input>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">宽度：</div>
          <div class="props-item-content">
            <NInputNumber
              placeholder={"宽度"}
              value={props.unit.props?.width || ""}
              onUpdate:value={(value) => {
                setProps(props.unit, "width", Number(value));
              }}
              v-slots={{
                suffix: () => {
                  return <div style={{ color: "#aaa" }}>px</div>;
                },
              }}
            ></NInputNumber>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">高度：</div>
          <div class="props-item-content">
            <NInputNumber
              placeholder={"高度"}
              value={props.unit.props?.height || ""}
              onUpdate:value={(value) => {
                setProps(props.unit, "height", Number(value));
              }}
              v-slots={{
                suffix: () => {
                  return <div style={{ color: "#aaa" }}>px</div>;
                },
              }}
            ></NInputNumber>
          </div>
        </div>
      </PropsEditBox>
    );
  },
  logicList: {
    onMounted: "初始化",
    onUpdate: "更新时",
    onClick: "点击时",
  },
});

registerConfig.register({
  label: "按钮",
  type: "form",
  name: "button",
  defaultWidth: 56,
  defaultHeight: 34,
  preview: () => (
    <PreviewBox>
      <NButton type="primary">按钮</NButton>
    </PreviewBox>
  ),
  render: (props) => {
    return <BasicButton {...props} />;
  },
  contextProps: [
    {
      name: "value",
      description: "按钮文本",
    },
  ],
  editProps: (props: { unit: IComponentUnit }) => {
    const btnOptions = [
      {
        label: "默认",
        value: "default",
      },
      {
        label: "tertiary",
        value: "tertiary",
      },
      {
        label: "primary",
        value: "primary",
      },
      {
        label: "info",
        value: "info",
      },
      {
        label: "success",
        value: "success",
      },
      {
        label: "warning",
        value: "warning",
      },
      {
        label: "error",
        value: "error",
      },
    ];
    return (
      <PropsEditBox>
        <div class="props-item">
          <div class="props-item-label">控件名：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"默认名为:" + props.unit.id}
              value={props.unit?.alias || ""}
              onUpdate:value={(value: string) => {
                props.unit.alias = value;
                // setPropsById(unit.id,{value:value});
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">按钮文本：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"请输入按钮名称"}
              value={props.unit.props?.value || ""}
              onUpdate:value={(value: string) => {
                if (props.unit.props) {
                  props.unit.props.value = value;
                } else {
                  props.unit.props = {
                    value,
                  };
                }
                // setPropsById(unit.id,{value:value});
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">按钮风格：</div>
          <div class="props-item-content">
            <NSelect
              placeholder={""}
              value={props.unit.props?.type || "primary"}
              options={btnOptions}
              onUpdate:value={(value: string) => {
                if (props.unit.props) {
                  props.unit.props.type = value;
                } else {
                  props.unit.props = {
                    type: value,
                  };
                }
                // setPropsById(unit.id,{value:value});
              }}
            ></NSelect>
          </div>
        </div>
      </PropsEditBox>
    );
  },
  logicList: {
    onMounted: "初始化",
    onClick: "点击时",
  },
});

registerConfig.register({
  label: "输入框",
  name: "input",
  type: "form",
  defaultWidth: 181,
  defaultHeight: 34,
  preview: () => (
    <PreviewBox>
      <NInput placeholder="输入框"></NInput>
    </PreviewBox>
  ),
  render: (props) => {
    return (
      <NInput
        placeholder={props.placeholder}
        type={props.type}
        defaultValue={props.defaultValue}
      ></NInput>
    );
  },
  contextProps: [
    {
      name: "value",
      description: "输入框内容",
    },
  ],
  editProps: (props: { unit: IComponentUnit }) => {
    const selectOptions = [
      {
        label: "文本",
        value: "text",
      },
      {
        label: "密码",
        value: "password",
      },
    ];
    return (
      <PropsEditBox>
        <div class="props-item">
          <div class="props-item-label">控件名：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"默认名为:" + props.unit.id}
              value={props.unit?.alias || ""}
              onUpdate:value={(value: string) => {
                props.unit.alias = value;
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">默认值：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"请输入文本框默认值"}
              value={props.unit.props?.defaultValue || ""}
              onUpdate:value={(value: string) => {
                setProps(props.unit, "defaultValue", value);
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">提示词：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"请输入提示词"}
              value={props.unit.props?.placeholder || ""}
              onUpdate:value={(value: string) => {
                setProps(props.unit, "placeholder", value);
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">类型：</div>
          <div class="props-item-content">
            <NSelect
              placeholder={"默认"}
              value={props.unit.props?.type || ""}
              options={selectOptions}
              onUpdate:value={(value: string) => {
                setProps(props.unit, "type", value);
              }}
            ></NSelect>
          </div>
        </div>
      </PropsEditBox>
    );
  },
  logicList: {
    onMounted: "初始化",
  },
});

registerConfig.register({
  label: "选择框",
  name: "select",
  type: "form",
  defaultWidth: 181,
  defaultHeight: 34,
  preview: () => (
    <PreviewBox>
      <NSelect placeholder="选择框"></NSelect>
    </PreviewBox>
  ),
  render: () => (
    <NSelect placeholder="请选择内容" style={{ width: "200px" }}></NSelect>
  ),
  editProps: (props: { unit: IComponentUnit }) => (
    <PropsEditBox>
      <div class="props-item">
        <div class="props-item-label">控件名：</div>
        <div class="props-item-content">
          <NInput
            placeholder={"默认名为:" + props.unit.id}
            value={props.unit?.alias || ""}
            onUpdate:value={(value: string) => {
              props.unit.alias = value;
            }}
          ></NInput>
        </div>
      </div>
    </PropsEditBox>
  ),
  logicList: {
    onMounted: "初始化",
  },
});

registerConfig.register({
  label: "复选框",
  type: "form",
  name: "checkbox",
  defaultWidth: 181,
  defaultHeight: 34,
  preview: () => (
    <PreviewBox>
      <NCheckbox>复选框</NCheckbox>
    </PreviewBox>
  ),
  render: () => <NCheckbox>复选框</NCheckbox>,
  editProps: (props: { unit: IComponentUnit }) => (
    <PropsEditBox>
      <div class="props-item">
        <div class="props-item-label">控件名：</div>
        <div class="props-item-content">
          <NInput
            placeholder={"默认名为:" + props.unit.id}
            value={props.unit?.alias || ""}
            onUpdate:value={(value: string) => {
              props.unit.alias = value;
            }}
          ></NInput>
        </div>
      </div>
    </PropsEditBox>
  ),
  logicList: {
    onMounted: "初始化",
  },
});

registerConfig.register({
  label: "开关",
  type: "form",
  name: "switch",
  defaultWidth: 181,
  defaultHeight: 34,
  preview: () => (
    <PreviewBox>
      <NSwitch>开关</NSwitch>
    </PreviewBox>
  ),
  render: () => <NSwitch>开关</NSwitch>,

  editProps: (props: { unit: IComponentUnit }) => (
    <PropsEditBox>
      <div class="props-item">
        <div class="props-item-label">控件名：</div>
        <div class="props-item-content">
          <NInput
            placeholder={"默认名为:" + props.unit.id}
            value={props.unit?.alias || ""}
            onUpdate:value={(value: string) => {
              props.unit.alias = value;
            }}
          ></NInput>
        </div>
      </div>
    </PropsEditBox>
  ),
  logicList: {
    onMounted: "初始化",
  },
});

registerConfig.register({
  label: "投影",
  type: "tem",
  name: "temporary",
  defaultWidth: 100,
  defaultHeight: 50,
  preview: () => <div placeholder="preview"></div>,
  render: (props: any) => {
    return (
      <div
        style={{
          width: props.size.width + "px",
          height: props.size.height + "px",
          backgroundColor: "#999",
          opacity: 0.5,
          border: "1px solid #333",
        }}
      ></div>
    );
  },
  props: {},
  editProps: () => <PropsEditBox></PropsEditBox>,
  logicList: {
    onMounted: "初始化",
  },
});

registerConfig.register({
  label: "图片",
  name: "image",
  type: "media",
  defaultWidth: 64,
  defaultHeight: 64,
  preview: () => (
    <PreviewBox>
      <svg
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4813"
        width="32"
        height="32"
      >
        <path
          d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z"
          fill="#707070"
          p-id="4814"
        ></path>
      </svg>
    </PreviewBox>
  ),
  render: (props: any) => {
    return <BasicImage {...props}></BasicImage>;
  },
  editProps: (props: { unit: IComponentUnit }) => (
    <PropsEditBox>
      <div class="props-item">
        <div class="props-item-label">控件名：</div>
        <div class="props-item-content">
          <NInput
            placeholder={"默认名为:" + props.unit.id}
            value={props.unit?.alias || ""}
            onUpdate:value={(value: string) => {
              props.unit.alias = value;
              // setPropsById(unit.id,{value:value});
            }}
          ></NInput>
        </div>
      </div>
      <div class="props-item">
        <div class="props-item-label">url：</div>
        <div class="props-item-content">
          <NInput
            placeholder={"请输入图片url"}
            value={props.unit.props?.url || ""}
            onUpdate:value={(value: string) => {
              setProps(props.unit, "url", value);
              // setPropsById(unit.id,{value:value});
            }}
          ></NInput>
        </div>
      </div>
      <div class="props-item">
        <div class="props-item-label">宽度：</div>
        <div class="props-item-content">
          <NInputNumber
            placeholder={"图片宽度"}
            value={props.unit.props?.width || ""}
            onUpdate:value={(value) => {
              setProps(props.unit, "width", Number(value));
            }}
            v-slots={{
              suffix: () => {
                return <div style={{ color: "#aaa" }}>px</div>;
              },
            }}
          ></NInputNumber>
        </div>
      </div>
      <div class="props-item">
        <div class="props-item-label">高度：</div>
        <div class="props-item-content">
          <NInputNumber
            placeholder={"图片高度"}
            value={props.unit.props?.height || ""}
            onUpdate:value={(value) => {
              setProps(props.unit, "height", Number(value));
            }}
            v-slots={{
              suffix: () => {
                return <div style={{ color: "#aaa" }}>px</div>;
              },
            }}
          ></NInputNumber>
        </div>
      </div>
    </PropsEditBox>
  ),
  contextProps: [
    {
      name: "url",
      description: "图片url",
    },
  ],
  logicList: {
    onMounted: "初始化",
  },
});

registerConfig.register({
  label: "播放器",
  name: "video",
  type: "media",
  defaultWidth: 500,
  defaultHeight: 350,
  preview: () => (
    <PreviewBox>
      <svg
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8512"
        width="32"
        height="32"
      >
        <path
          d="M209.8 496.7c17.1 0 31.1-13.9 31.1-31.1 0-17.1-13.9-31-31.1-31s-31 13.9-31 31c-0.1 17.2 13.8 31.1 31 31.1zM345.1 750.2h-66c-37.3 0-45.9-8.6-45.9-45.9V534l-0.2-2.2h-0.2c-1.6-12.7-12.2-22.3-25.1-22.3-12.9 0-23.5 9.6-25.1 22.3h-0.4v172.4c0 66 30.8 96.8 96.8 96.8h66c14 0 25.4-11.4 25.4-25.4 0.1-14.1-11.3-25.4-25.3-25.4z"
          fill="#6B400D"
          p-id="8513"
        ></path>
        <path
          d="M959.3 251.8c0-71.9-58.5-130.4-130.4-130.4H194.7c-71.9 0-130.4 58.5-130.4 130.4v523.3c0 71.9 58.5 130.4 130.4 130.4h634.2c71.9 0 130.4-58.5 130.4-130.4V251.8z m-50.6 523.3c0 44-35.8 79.8-79.8 79.8H194.7c-44 0-79.8-35.8-79.8-79.8V251.8c0-44 35.8-79.8 79.8-79.8h634.2c44 0 79.8 35.8 79.8 79.8v523.3z"
          fill="#6B400D"
          p-id="8514"
        ></path>
        <path
          d="M684.1 469.8L486.1 343c-8.6-4.8-17.8-7-29.7-7-34 0-56 17.4-56 44.3v266.2c0 26.9 22 44.3 56 44.3 6.4 0 18.8-0.9 29.9-7.1l197.4-126.5c17.7-9 28.2-25.5 28.2-43.9 0-18.3-10.5-34.7-27.8-43.5z m-27.5 55.7L472 643.7c-3.2 1.5-4.9 1.5-8.1 1.5-8.1 0-16.2-6-16.2-15.1V396.7c0-9 8.1-15.1 16.2-15.1 3.2 0 6.5 0 8.1 1.5l184.6 118.2c6.5 4.5 8.1 10.5 8.1 12 0 3.2 0 9.2-8.1 12.2z"
          fill="#6B400D"
          p-id="8515"
        ></path>
        <path
          d="M656.6 501.4L472 383.2c-1.6-1.5-4.9-1.5-8.1-1.5-8.1 0-16.2 6-16.2 15.1v233.4c0 9 8.1 15.1 16.2 15.1 3.2 0 4.9 0 8.1-1.5l184.6-118.2c8.1-3 8.1-9 8.1-12 0-1.6-1.7-7.7-8.1-12.2z"
          fill="#FFD524"
          p-id="8516"
        ></path>
      </svg>
    </PreviewBox>
  ),
  render: (props: any) => {
    return <BasicVideo {...props}></BasicVideo>;
  },
  editProps: (props: { unit: IComponentUnit }) => (
    <PropsEditBox>
      <div class="props-item">
        <div class="props-item-label">控件名：</div>
        <div class="props-item-content">
          <NInput
            placeholder={"默认名为:" + props.unit.id}
            value={props.unit?.alias || ""}
            onUpdate:value={(value: string) => {
              props.unit.alias = value;
              // setPropsById(unit.id,{value:value});
            }}
          ></NInput>
        </div>
      </div>
      <div class="props-item">
        <div class="props-item-label">src：</div>
        <div class="props-item-content">
          <NInput
            placeholder={"请输入视频路径"}
            value={props.unit.props?.src || ""}
            onUpdate:value={(value: string) => {
              setProps(props.unit, "src", value);
              // setPropsById(unit.id,{value:value});
            }}
          ></NInput>
        </div>
      </div>
      <div class="props-item">
        <div class="props-item-label">宽度：</div>
        <div class="props-item-content">
          <NInputNumber
            placeholder={"视频宽度"}
            value={props.unit.props?.width || ""}
            onUpdate:value={(value) => {
              setProps(props.unit, "width", Number(value));
            }}
            v-slots={{
              suffix: () => {
                return <div style={{ color: "#aaa" }}>px</div>;
              },
            }}
          ></NInputNumber>
        </div>
      </div>
      <div class="props-item">
        <div class="props-item-label">高度：</div>
        <div class="props-item-content">
          <NInputNumber
            placeholder={"视频高度"}
            value={props.unit.props?.height || ""}
            onUpdate:value={(value) => {
              setProps(props.unit, "height", Number(value));
            }}
            v-slots={{
              suffix: () => {
                return <div style={{ color: "#aaa" }}>px</div>;
              },
            }}
          ></NInputNumber>
        </div>
      </div>
    </PropsEditBox>
  ),
  contextProps: [
    {
      name: "src",
      description: "视频src",
    },
  ],
  logicList: {
    onMounted: "初始化",
  },
});


registerConfig.register({
  label: "折线图",
  name: "lineChart",
  type: "chart",
  defaultWidth: 300,
  defaultHeight: 280,
  preview: () => (
    <PreviewBox>
      <div>折线图</div>
    </PreviewBox>
  ),
  render: (props) => {
    return (
      <LineChart {...props}></LineChart>
    );
  },
  contextProps: [
    {
      name: "dataSource",
      description: "图表数据源",
    },
  ],
  editProps: (props: { unit: IComponentUnit }) => {
    return (
      <PropsEditBox>
        <div class="props-item">
          <div class="props-item-label">控件名：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"默认名为:" + props.unit.id}
              value={props.unit?.alias || ""}
              onUpdate:value={(value: string) => {
                props.unit.alias = value;
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">x轴：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"请输入x轴所表示的值"}
              value={props.unit.props?.xAxis || ""}
              onUpdate:value={(value: string) => {
                setProps(props.unit, "xAxis", value);
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">y轴：</div>
          <div class="props-item-content">
            <NInput
              placeholder={"请输入y轴所表示的值"}
              value={props.unit.props?.yAxis || ""}
              onUpdate:value={(value: string) => {
                setProps(props.unit, "yAxis", value);
              }}
            ></NInput>
          </div>
        </div>
        <div class="props-item">
          <div class="props-item-label">数据源：</div>
          <div class="props-item-content">
            <NInput
              placeholder={`请输入数据源,格式为:
[{
  name:"str",
  value:111
}]
                `}
              type="textarea"
              value={props.unit.props?.value || ""}
              onUpdate:value={(value: string) => {
                setProps(props.unit, "value", value);
              }}
            ></NInput>
          </div>
        </div>
      </PropsEditBox>
    );
  },
  logicList: {
    onMounted: "初始化",
  },
});