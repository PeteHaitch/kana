import React, { useEffect, useState } from "react";
import PCABarPlot from "../Plots/PCABarPlot";
import ClusterBarPlot from "../Plots/ClusterBarPlot";
import CellLabelTable from "../Plots/CellLabelTable";

import { useContext } from "react";
import { AppContext } from "./../../context/AppContext";
import { Card, Elevation, Classes } from "@blueprintjs/core";
import QCPlotMgr from "../Plots/QCPlotMgr";

import { code, isObject } from "../../utils/utils";

import "./Gallery.css";
import UDimPlot from "../Plots/uDimPlot";

import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { SortableItem } from "./SortableItem";

import { Popover2 } from "@blueprintjs/popover2";

const Gallery = (props) => {
  const [defaultItems, setDefaultItems] = useState([]);
  const [items, setItems] = useState([]);
  const [itemContent, setItemContent] = useState({});
  const { datasetName, annotationObj } = useContext(AppContext);
  const [qcids, setQCids] = useState([]);
  const default_cluster = `${code}::CLUSTERS`;

  function get_image_title(data) {
    let text = ` ${data?.config?.embedding} `;
    if (data?.config?.gene) {
      text += `⊃ ${data?.config?.gene} `;
    }

    let set = false;

    if (data?.config?.annotation) {
      const sanitized_anno = data.config?.annotation.replace(`${code}::`, "");
      text += `⊃ ${sanitized_anno.toLowerCase()} `;

      if (data?.config?.highlight) {
        if (String(data?.config?.highlight).startsWith("cs")) {
          text += `(selection ${data?.config?.highlight.replace("cs", "")}) `;
        } else {
          text += `(${data?.config?.highlight
            .replace("Cluster ", "")
            .replace(`${code}::`, "")}) `;
        }
      }

      set = true;
    }

    if (props?.clusHighlightLabel !== null) {
      if (
        !(
          data.config?.highlight !== null &&
          props?.clusHighlightLabel !== null &&
          data.config?.highlight === props?.clusHighlightLabel &&
          data.config?.annotation !== null &&
          props?.colorByAnnotation !== null &&
          data.config?.annotation === props?.colorByAnnotation
        )
      ) {
        if (set) {
          text += "∩ ";
        } else {
          text += "⊃ ";
        }

        if (props?.colorByAnnotation) {
          text += `${props?.colorByAnnotation
            .replace(`${code}::`, "")
            .toLowerCase()} `;
        }

        text += `(${props?.clusHighlightLabel
          .replace("Cluster ", "")
          .replace(`${code}::`, "")})`;
      }
    }

    if (props?.clusHighlight === null && props?.selectedPoints) {
      text += "⊃ (unsaved selection)";
    }

    return text;
  }

  useEffect(() => {
    get_children();
  }, [
    props?.qcData,
    props?.pcaVarExp,
    props?.clusterColors,
    props?.cellLabelData,
    props?.redDimsData,
  ]);

  useEffect(() => {
    if (props?.savedPlot && Array.isArray(props?.savedPlot)) {
      let tmpItems = [...defaultItems];
      tmpItems.reverse();
      let tmpItemContent = { ...itemContent };

      let actions = ["select", "download", "trash"];
      if (props?.selectedPoints && props?.selectedPoints.length > 0) {
        actions = ["highlight", "select", "download", "trash"];
      }

      if (props?.savedPlot.length === 0) {
        tmpItems = tmpItems.filter((x) => parseInt(x) < 100);
      }

      props?.savedPlot.map((x, i) => {
        if (!tmpItems.includes(`${100 + i}`)) {
          tmpItems.push(`${100 + i}`);
        }
        tmpItemContent[`${100 + i}`] = {
          // id: 5 + i,
          title: get_image_title(x),
          className: "gitem",
          actions: actions,
          data: x,
          content: (
            <UDimPlot
              embeddata={props?.redDimsData[x.config.embedding]}
              selectedPoints={props?.selectedPoints}
              setSelectedPoints={props?.setSelectedPoints}
              highlightPoints={props?.highlightPoints}
              colorByAnnotation={props?.colorByAnnotation}
              data={x}
            />
          ),
        };
      });

      setItems(tmpItems.reverse());
      setItemContent(tmpItemContent);
    }
  }, [props?.savedPlot]);

  function get_children() {
    let tmpItems = [];
    let tmpItemContent = {};

    if (props?.qcData && isObject(props?.qcData?.data)) {
      let tqcid = [...qcids];
      Object.keys(props?.qcData?.data).map((x, qci) => {
        let tqc = {
          data: props?.qcData?.data[x],
          ranges: props?.qcData?.ranges[x],
          thresholds: props?.qcData?.thresholds[x],
        };

        if (!tmpItems.includes(`${1 + qci}`)) {
          tmpItems.push(`${1 + qci}`);
          tqcid.push(`${1 + qci}`);
        }

        let title = `QC for batch: ${x}`;
        if (x === "default") {
          title = "QC metrics (RNA)";
        } else if (x === "adt_default") {
          title = "QC metrics (ADT)";
        } else if (x.startsWith("adt") && x !== "adt_default") {
          title = `QC for batch:${x.replace("adt_", "")} (ADT) `;
        } else if (x === "crispr_default") {
          title = "QC metrics (CRISPR)";
        } else if (x.startsWith("crispr") && x !== "crispr_default") {
          title = `QC for batch:${x.replace("crispr_", "")} (CRISPR) `;
        } else {
          title = `QC for batch:${x} (RNA) `;
        }

        tmpItemContent[`${1 + qci}`] = {
          // id: 1,
          title: title,
          className: props?.showQCLoader
            ? "gitem effect-opacitygrayscale"
            : "gitem",
          actions: ["download"],
          content: (
            <QCPlotMgr title={x} data={tqc} windowWidth={props?.windowWidth} />
          ),
        };
      });

      setQCids(tqcid);
    } else {
      if (qcids && qcids.length > 0) {
        qcids.map((x) => {
          tmpItems.splice(tmpItems.indexOf(x), 1);
          delete tmpItemContent[`${x}`];
        });
        setQCids([]);
      }
    }

    if (Object.keys(props?.pcaVarExp).length > 0) {
      Object.keys(props?.pcaVarExp).map((x, i) => {
        if (!tmpItems.includes(`${20 + i}`)) {
          tmpItems.push(`${20 + i}`);
        }
        tmpItemContent[`${20 + i}`] = {
          // id: 2,
          title: `PCA (${x}): % variance explained`,
          className: props?.showPCALoader
            ? "gitem effect-opacitygrayscale"
            : "gitem",
          actions: ["download"],
          content: (
            <PCABarPlot
              title={datasetName.split(" ").join("_")}
              pca={props?.pcaVarExp[x]}
            />
          ),
        };
      });
    }

    if (annotationObj[default_cluster] && props?.clusterColors) {
      if (!tmpItems.includes("30")) {
        tmpItems.push("30");
      }
      tmpItemContent["30"] = {
        // id: 3,
        title: "Cluster: Num. of cells per cluster",
        className: props?.showNClusLoader
          ? "gitem effect-opacitygrayscale"
          : "gitem",
        actions: ["download"],
        content: (
          <ClusterBarPlot
            data={annotationObj[default_cluster]}
            clusterColors={props?.clusterColors}
            setClusHighlight={props?.setClusHighlight}
            clusHighlight={props?.clusHighlight}
          />
        ),
      };
    }


    // default plots, tSNE and UMAP
    if (props?.redDimsData && Object.keys(props.redDimsData).length > 0) {
      let actions = ["select", "download"];
      if (props?.selectedPoints && props?.selectedPoints.length > 0) {
        actions = ["highlight", "select", "download"];
      }

      let colors = [];
      annotationObj[default_cluster]?.forEach(
        (x, i) => (colors[i] = props?.clusterColors[x])
      );

      Object.keys(props.redDimsData).map((x, i) => {
        if (!tmpItems.includes(`${55 + i}`)) {
          tmpItems.push(`${55 + i}`);
        }
        tmpItemContent[`${55 + i}`] = {
          // id: 5 + i,
          title: get_image_title({
            color: colors,
            config: {
              embedding: x,
              annotation: props?.selectedDimPlotCluster,
              highlight: null,
              gene: null,
            },
          }),
          className: "gitem",
          actions: actions,
          data: {
            color: colors,
            config: {
              embedding: x,
              annotation: props?.selectedDimPlotCluster,
              highlight: null,
              gene: null,
            },
          },
          content: (
            <UDimPlot
              embeddata={props?.redDimsData[x]}
              selectedPoints={props?.selectedPoints}
              setSelectedPoints={props?.setSelectedPoints}
              highlightPoints={props?.highlightPoints}
              colorByAnnotation={props?.colorByAnnotation}
              data={{
                color: colors,
                config: {
                  embedding: x,
                  annotation: props?.selectedDimPlotCluster,
                  highlight: null,
                  gene: null,
                },
              }}
            />
          ),
        };
      });
    }

    setItems(tmpItems.reverse());
    setDefaultItems(tmpItems);
    setItemContent(tmpItemContent);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      // active.className.replace("high", "");
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // function handleDragStart(event) {
  //   const { active, over } = event;

  //   if (active.id !== over.id) {
  //     active.className += " high"
  //   }
  // }
  // onDragStart={handleDragStart}

  return (
    <DndContext modifiers={[restrictToWindowEdges]} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((x, i) => (
          <SortableItem
            setSelectedPoints={props?.setSelectedPoints}
            setRestoreState={props?.setRestoreState}
            savedPlot={props?.savedPlot}
            setSavedPlot={props?.setSavedPlot}
            items={items}
            setItems={setItems}
            itemContent={itemContent}
            setItemContent={setItemContent}
            key={i + x}
            id={x}
            {...itemContent[x]}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default React.memo(Gallery);
