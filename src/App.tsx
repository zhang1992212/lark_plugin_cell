import './App.css';
import { useEffect, useCallback, useState,useRef } from 'react';
import './i18n'; // 取消注释以启用国际化
import { useTranslation } from "react-i18next";
import { FieldType, IAttachmentField,Selection } from "@lark-base-open/js-sdk";
import { bitable }  from "@lark-base-open/js-sdk"
import { Card } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
type CardList = {
  id:number
  content:string
}

export default function App() {
  const [cardList,setCardList] = useState<Array<CardList>>(new Array<CardList>());
  const onSelectChange = useCallback(async  (event: { data: Selection })=>{
    // console.log('current selection', event)
    const table = await bitable.base.getActiveTable();
    const base = (table as any).base;
    const select = await base.getSelection();
    const field = await table.getField<IAttachmentField>(select.fieldId);
    const vals =
        (await field
            .getValue(select.recordId)
            .catch((err: any) => [])) || [];
    if ((await field.getType()) === FieldType.Text) {
      vals.map((val: any, i: string | number) => {
        console.log("1")
        let card = JSON.parse(val.text)
        console.log("c",card)
        setCardList(card)
      });
    }
  }, ["current"])
  const [i18n] = useTranslation();
  const onSelectionChangeRef = useRef(onSelectChange);
  onSelectionChangeRef.current = onSelectChange;
  const init = useCallback(async () => {
    bitable.base.onSelectionChange(onSelectionChangeRef.current)
  }, [i18n]);
  useEffect(() => {
    console.log("----")
    init();
  });

  const ListComponent = () => {
    const items = [];
    for (let i = 0; i < cardList.length; i++) {
      items.push(
      <Card variant="outlined" className="card">
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {cardList[i].id}
          </Typography>
          <Typography variant="body2" component="p">
            {cardList[i].content}
          </Typography>
        </CardContent>
      </Card>
      );
    }
    return <ul>{items}</ul>;
  };

  return (
    <div>
      {ListComponent()}
    </div>
  );
}