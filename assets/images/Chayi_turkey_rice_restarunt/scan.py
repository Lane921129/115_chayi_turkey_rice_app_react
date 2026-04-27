import os

# 設定圖片根目錄的路徑 (請根據你 py 檔存放的位置調整)
# 假設你的 py 檔在專案根目錄，圖片在 assets/images/Chayi_turkey_rice_restarunt
base_dir = './assets/images/Chayi_turkey_rice_restarunt'

# TS 檔內使用的相對路徑前綴 (從你的 .tsx 檔出發到圖片的路徑)
# 根據你的圖片截圖，假設是在 (tabs)/ 裡面引用，路徑通常是 ../assets/images/...
path_prefix = '../assets/images/Chayi_turkey_rice_restarunt'

def generate_ts_record():
    if not os.path.exists(base_dir):
        print(f"錯誤：找不到目錄 {base_dir}")
        return

    output = "export const restaurantImages: Record<string, any[]> = {\n"
    
    # 取得所有子資料夾 (餐廳名稱)
    restaurants = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    
    for restaurant in restaurants:
        res_path = os.path.join(base_dir, restaurant)
        # 取得該資料夾下所有的 jpg 或 png 檔案
        images = [f for f in os.listdir(res_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        output += f'  "{restaurant}": [\n'
        for img in images:
            # 產生格式：require('../assets/images/Chayi_turkey_rice_restarunt/餐廳名/檔名.jpg'),
            output += f"    require('{path_prefix}/{restaurant}/{img}'),\n"
        output += "  ],\n"
    
    output += "};"
    
    # 將結果輸出到檔案或印出來
    with open('restaurantImages.ts', 'w', encoding='utf-8') as f:
        f.write(output)
    
    print("生成成功！請查看 restaurantImages.ts")

if __name__ == "__main__":
    generate_ts_record()