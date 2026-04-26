import os

# 1. 設定你的圖片路徑 (相對於此腳本的位置)
# 請確認路徑名稱與你電腦中的資料夾名稱完全一致
base_folder = "constants/images/Chayi_turkey_rice_restarunt"
# 2. 設定輸出的檔案名稱
output_file = "constants/restaurantImages.ts"

def generate_images_config():
    if not os.path.exists(base_folder):
        print(f"找不到路徑: {base_folder}，請檢查路徑是否正確。")
        return

    content = [
        "// 此檔案由腳本自動產生，請勿手動修改",
        "export const RESTAURANT_IMAGES: Record<string, any[]> = {"
    ]

    # 取得所有店家資料夾
    # 使用 sorted 確保每次生成的順序一致，Git 比較好追蹤變更
    for store_name in sorted(os.listdir(base_folder)):
        store_path = os.path.join(base_folder, store_name)
        
        # 只處理資料夾
        if os.path.isdir(store_path):
            content.append(f'  "{store_name}": [')
            
            # 取得店家資料夾內的所有圖片
            images = sorted([f for f in os.listdir(store_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
            
            for img in images:
                # 這裡的路徑必須是相對未來產生的 restaurantImages.ts 的路徑
                # 所以路徑開頭會是 ./images/...
                img_path = f'require("./images/Chayi_turkey_rice_restarunt/{store_name}/{img}")'
                content.append(f'    {img_path},')
            
            content.append('  ],')

    content.append("};")

    # 寫入檔案，確保使用 utf-8 避免中文亂碼
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("\n".join(content))
    
    print(f"完成！已生成 {output_file}")
    print(f"共處理了 {len(content)//5} 間店家。") # 粗略估計

if __name__ == "__main__":
    generate_images_config()