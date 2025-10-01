"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExternalLink, Folder, Github, Info } from "lucide-react"

interface InfoDialogProps {
    databaseStatus?: {
        latest: string;
        earliest: string;
        total: number;
    } | null;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ databaseStatus }) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed right-4 bottom-4 z-40 shadow-lg"
                >
                    <Info className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>關於這個地圖</DialogTitle>
                    <DialogDescription className="space-y-6 text-start">
                        <p className="flex flex-col gap-2">
                            <span>這是一個將中央氣象署提供的台灣歷史上地震資料視覺化後，呈現在互動式地圖上的專案。</span>
                            <span>你可以使用左側的篩選器(手機板在右下方漏斗)來設定日期、規模與深度，並點擊地圖上的圓圈來查看詳細資訊。</span>
                            <span>中央氣象署開放資料平台提供的地震資料更新頻率為每月，並由本專案的後端服務自動同步到資料庫中。</span>
                        </p>
                        {databaseStatus && (
                            <p className="grid">
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">最新資料時間</span>
                                    <span className="text-base">{databaseStatus.latest ? new Date(databaseStatus.latest).toLocaleString() : "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">最早資料時間</span>
                                    <span className="text-base">{databaseStatus.earliest ? new Date(databaseStatus.earliest).toLocaleString() : "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">總計</span>
                                    <span className="text-base">{databaseStatus.total ?? 0} 筆</span>
                                </div>
                            </p>
                        )}
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                資料來源
                                <a
                                    href="https://opendata.cwa.gov.tw/index"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer trasition-color duration-250 flex gap-1 items-center"
                                >
                                    <ExternalLink className="h-5 w-5" /> 中央氣象署開放資料平台
                                </a>
                            </div>
                            <div className="flex gap-2">
                                開發者
                                <a
                                    href="https://github.com/AiverAiva"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer trasition-color duration-250 flex gap-1 items-center"
                                >
                                    <Github className="h-5 w-5" /> AiverAiva
                                </a>
                            </div>
                            <div className="flex gap-2">
                                專案原始碼
                                <a
                                    href="https://github.com/AiverAiva/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 cursor-pointer trasition-color duration-250 flex gap-1 items-center"
                                >
                                    <Folder className="h-5 w-5" /> AiverAiva/
                                </a>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default InfoDialog
