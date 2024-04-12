/* eslint-disable react-refresh/only-export-components */
import { notification, Modal } from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { NotificationInstance } from "antd/es/notification/interface";
import React, { createContext } from "react";

type AntdCtxType = {
  notificationApi?: NotificationInstance;
  modalApi?: HookAPI;
};

export const antdCtx = createContext<AntdCtxType>({
  notificationApi: undefined,
  modalApi: undefined,
});

export default function AntdCtxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nApi, nCtxHolder] = notification.useNotification();
  const [mApi, mCtxHolder] = Modal.useModal();

  return (
    <antdCtx.Provider value={{ notificationApi: nApi, modalApi: mApi }}>
      {children}
      {nCtxHolder}
      {mCtxHolder}
    </antdCtx.Provider>
  );
}
