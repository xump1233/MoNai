import { defineComponent, ref } from "vue";
import { registerConfig as config } from "@/hooks/useEditorConfig";
import "./index.less";
import type { IBasicComponent, IComponentUnit } from "@/interface";
import useDrag from "../../hooks/useDrag";
import useStoreMove from "./hooks/useStoreMove";
import useResize from "./hooks/useResize";
import useSchedule from "../../hooks/useSchedule";
import usePageData from "@/hooks/usePageData";
import { NTag, NEllipsis, NTabs, NTabPane, NButton, NInput } from "naive-ui";

import ToWindowIcon from "./components/ToWindowIcon";
import ToMinIcon from "./components/ToMinIcon";
import ToLeftIcon from "./components/ToLeftIcon";

const List = defineComponent({
  setup() {
    const { pageData, focusUnit, unFocusAllUnit } = usePageData();
    const components = pageData.value.components.map((u) => {
      return {
        label: u.name,
        value: u.id,
        alias: u.alias,
      };
    });
    return () => (
      <div class="store-list-container">
        <div style={{ paddingBottom: "5px", borderBottom: "1px solid #999" }}>
          当前页面组件列表：
        </div>
        {components &&
          components.map((item) => {
            return (
              <div
                class="store-list-item"
                onClick={() => {
                  unFocusAllUnit();
                  focusUnit(item.value);
                }}
              >
                <NTag type="success">
                  {config.componentMap[item.label].label}
                </NTag>
                <NEllipsis style={{ marginLeft: "10px" }}>
                  {item.alias || item.value}
                </NEllipsis>
              </div>
            );
          })}
      </div>
    );
  },
});

export default defineComponent({
  props: {},
  setup() {
    const StoreState = ref<"left" | "min" | "float">("left");
    const ClassMap = {
      left: "",
      min: "min-state",
      float: "float-state",
    };
    let lastState: "left" | "min" | "float" = "float";
    const { dragStart } = useDrag();
    const { mouseDown, storePosition } = useStoreMove({
      top: 50,
      left: 200,
    });
    const { targetRect, resizeDown, offsetX, offsetY } = useResize({
      width: 600,
      height: 500,
    });
    const { pushItem } = useSchedule();
    const componentList = config.componentList;

    const { importComponents } = usePageData();
    const importContent = ref<string>();
    function insertComponents() {
      if (!importContent.value) {
        (window as any).message.warning("导入值不能为空!");
        return;
      }
      try {
        const components = JSON.parse(importContent.value) as IComponentUnit[];
        importComponents(components);
        (window as any).message.success("导入成功!");
      } catch (err) {
        (window as any).message.warning("值解析错误!请检查数据是否有误。");
      }
    }

    return () => (
      <div
        class={`page-editor-component-store unselectable ${
          ClassMap[StoreState.value]
        }`}
        style={
          StoreState.value === "float" && {
            top: storePosition.value.top + offsetY.value + "px",
            left: storePosition.value.left + offsetX.value + "px",
            width: targetRect.value.width + "px",
            height: targetRect.value.height + "px",
          }
        }
      >
        <div
          class="store-top"
          onMousedown={(e: MouseEvent) => {
            StoreState.value === "float" && mouseDown(e);
          }}
        >
          <div class="top-title">组件市场</div>
          <div class="top-operate">
            <ToMinIcon
              onClick={() => {
                lastState = StoreState.value;
                StoreState.value = "min";
                pushItem({
                  name: "组件集",
                  textColor: "black",
                  bgColor: "rgba(0, 188, 212, 0.3)",
                  icon: (
                    <svg
                      class="icon"
                      viewBox="0 0 1200 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="5235"
                      width="22"
                      height="22"
                    >
                      <path
                        d="M867.279292 192.502115l-61.291732-77.521098a63.269402 63.269402 0 0 0-49.787395-25.204602H244.771159a70.083455 70.083455 0 0 0-51.729432 25.204602l-57.444184 77.521098a174.311115 174.311115 0 0 0-34.473816 135.550565 177.681171 177.681171 0 0 0 74.6998 116.317281 102.835273 102.835273 0 0 0 24.911515 13.555056c3.664034 1.942036 5.752169 1.942036 9.562301 3.883182s5.751278 1.942036 9.56141 3.883181c7.65679 1.942036 13.408958 3.884072 21.065749 5.825218a64.441751 64.441751 0 0 0 19.160236 1.942037h24.911514a32.239583 32.239583 0 0 0 13.408959-1.942037h5.752169c5.751278-1.942036 11.503447-1.942036 17.255615-3.884072h1.904621c5.751278-1.941145 9.561411-3.883182 15.313579-5.824327 1.904621 0 3.663144-1.942036 5.751278-1.942036l11.503447-5.825218c1.905512-1.942036 3.664034-1.942036 5.752169-3.883182a41.800994 41.800994 0 0 0 9.56141-5.824327c1.905512-1.942036 3.664034-1.942036 3.664035-3.884072 3.663144-3.883182 9.561411-7.766363 13.408067-11.613021a170.427042 170.427042 0 0 0 229.850679 0c3.663144 3.884072 9.561411 7.766363 13.408067 11.613021 1.905512 1.942036 3.664034 1.942036 3.664035 3.884072a41.764469 41.764469 0 0 1 9.56141 5.824327c1.904621 1.942036 3.663144 1.942036 5.752169 3.884073l11.503447 5.824327c1.904621 0 3.663144 1.942036 5.751278 1.942036a130.642025 130.642025 0 0 0 15.313579 5.825218h1.905512a55.35605 55.35605 0 0 0 17.255615 3.883181h5.751278c3.663144 0 9.561411 1.942036 13.408068 1.942037h24.912405c5.751278 0 13.408068-1.942036 19.160236-1.942037 7.65679-1.942036 15.313579-3.884072 21.064857-5.825218 3.664034-1.942036 5.752169-1.942036 9.562302-3.884072s5.751278-1.941145 9.56141-3.882291A167.240499 167.240499 0 0 0 903.328117 328.05268a180.759031 180.759031 0 0 0-36.379327-135.550565h0.329612zM730.959039 531.708141a205.413983 205.413983 0 0 1-114.925785-34.876477 206.696796 206.696796 0 0 1-229.849787 0 205.451398 205.451398 0 0 1-114.924894 34.876477 233.073746 233.073746 0 0 1-38.320473-3.883182 223.475811 223.475811 0 0 1-57.444184-19.380274v236.481217a77.300169 77.300169 0 0 0 76.60353 77.521098h497.985305a77.300169 77.300169 0 0 0 76.60353-77.521098V508.444685a189.588169 189.588169 0 0 1-55.538673 19.380274 282.421956 282.421956 0 0 1-40.299033 3.884072h0.110464z"
                        p-id="5236"
                      ></path>
                    </svg>
                  ),
                  cb: () => {
                    StoreState.value = lastState;
                  },
                });
              }}
            ></ToMinIcon>
            {StoreState.value === "float" ? (
              <ToLeftIcon
                onClick={() => {
                  StoreState.value = "left";
                }}
              ></ToLeftIcon>
            ) : (
              <ToWindowIcon
                onClick={() => {
                  StoreState.value = "float";
                }}
              ></ToWindowIcon>
            )}
          </div>
        </div>
        <div class="store-container">
          <NTabs
            key={"store-nav"}
            type="line"
            placement="left"
            style={{
              height: "100%",
            }}
            tabStyle={{
              color: "#f66",
              fontSize: "14px",
            }}
          >
            <NTabPane name="表单" class={"store-nav-item"}>
              {componentList &&
                (() => {
                  const cl = componentList.filter(
                    (item) => item.type === "form"
                  );
                  let LastRender = () => <div></div>;
                  const result = cl.map((item: IBasicComponent) => {
                    const Render = item.preview;
                    LastRender = Render;
                    return (
                      <div
                        class="store-item"
                        draggable="true"
                        onDragstart={(e) => dragStart(e, item)}
                      >
                        <Render></Render>
                      </div>
                    );
                  });
                  if (result.length % 2 !== 0) {
                    result.push(
                      <div class={"store-item"} style={{ opacity: 0 }}>
                        <LastRender></LastRender>
                      </div>
                    );
                  }
                  return result;
                })()}
            </NTabPane>
            <NTabPane name="图表" class={"store-nav-item"}>
              {componentList &&
                (() => {
                  const cl = componentList.filter(
                    (item) => item.type === "chart"
                  );
                  let LastRender = () => <div></div>;
                  const result = cl.map((item: IBasicComponent) => {
                    const Render = item.preview;
                    LastRender = Render;
                    return (
                      <div
                        class="store-item"
                        draggable="true"
                        onDragstart={(e) => dragStart(e, item)}
                      >
                        <Render></Render>
                      </div>
                    );
                  });
                  if (result.length % 2 !== 0) {
                    result.push(
                      <div class={"store-item"} style={{ opacity: 0 }}>
                        <LastRender></LastRender>
                      </div>
                    );
                  }
                  return result;
                })()}
            </NTabPane>
            <NTabPane name="媒体" class={"store-nav-item"}>
              {componentList &&
                (() => {
                  const cl = componentList.filter(
                    (item) => item.type === "media"
                  );
                  let LastRender = () => <div></div>;
                  const result = cl.map((item: IBasicComponent) => {
                    const Render = item.preview;
                    LastRender = Render;
                    return (
                      <div
                        class="store-item"
                        draggable="true"
                        onDragstart={(e) => dragStart(e, item)}
                      >
                        <Render></Render>
                      </div>
                    );
                  });
                  if (result.length % 2 !== 0) {
                    result.push(
                      <div class={"store-item"} style={{ opacity: 0 }}>
                        <LastRender></LastRender>
                      </div>
                    );
                  }
                  return result;
                })()}
            </NTabPane>
            <NTabPane name="拓展" class={"store-nav-item"}>
              {componentList &&
                (() => {
                  const cl = componentList.filter(
                    (item) => item.type === "extends"
                  );
                  let LastRender = () => <div></div>;
                  const result = cl.map((item: IBasicComponent) => {
                    const Render = item.preview;
                    LastRender = Render;
                    return (
                      <div
                        class="store-item"
                        draggable="true"
                        onDragstart={(e) => dragStart(e, item)}
                      >
                        <Render></Render>
                      </div>
                    );
                  });
                  if (result.length % 2 !== 0) {
                    result.push(
                      <div class={"store-item"} style={{ opacity: 0 }}>
                        <LastRender></LastRender>
                      </div>
                    );
                  }
                  return result;
                })()}
            </NTabPane>
            <NTabPane name="列表" class={"store-nav-item"}>
              <List></List>
            </NTabPane>
            <NTabPane
              name="导入"
              class={"store-nav-item"}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: "100%", height: "100%" }}>
                <NInput
                  type="textarea"
                  style={{ width: "95%", height: "300px" }}
                  value={importContent.value}
                  onUpdate:value={(value:string)=>{
                    importContent.value = value;
                  }}
                  placeholder={"请输入要插入的组件代码"}
                ></NInput>
                <NButton
                  type="success"
                  style={{
                    position: "relative",
                    width: "80%",
                    top: "30px",
                    left: "15px",
                  }}
                  onClick={() => {
                    insertComponents();
                  }}
                >
                  导入
                </NButton>
              </div>
            </NTabPane>
          </NTabs>
        </div>
        {StoreState.value === "float" && (
          <>
            <div
              class="edge-lr edge-left"
              onMousedown={(e: MouseEvent) => {
                resizeDown(e, "left");
              }}
            ></div>
            <div
              class="edge-lr edge-right"
              onMousedown={(e: MouseEvent) => {
                resizeDown(e, "right");
              }}
            ></div>
            <div
              class="edge-tb edge-top"
              onMousedown={(e: MouseEvent) => {
                resizeDown(e, "top");
              }}
            ></div>
            <div
              class="edge-tb edge-bottom"
              onMousedown={(e: MouseEvent) => {
                resizeDown(e, "bottom");
              }}
            ></div>
          </>
        )}
      </div>
    );
  },
});
