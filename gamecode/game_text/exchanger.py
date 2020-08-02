import os
import json
from glob import glob

root = os.path.split(os.path.realpath(__file__))[0]
text_files = glob(root+"/text_script/*_text.json")

code_parse = {}

for file in text_files:
    with open(file, encoding='UTF-8') as f:
        fileobj = json.load(f)
        pkg = fileobj["packname"]
        code_parse[pkg] = {}
        for script in fileobj["script"]:
            code_parse[pkg][script["code"]] = script
    f.close()

def ReturnText(code):
    script_pack, code = code.split('-')
    script = code_parse[script_pack][code]
    ret = {
        "type":"plaintext",
        "content":script["text"],
        "next":script["next"]
    }
    if("next_cate" in script):
        ret["next"] = script["next_cate"] + "-" + script["next"]
    else:
        ret["next"] = "script-" + script["next"]
    if("next_text" in script):
        ret["next_text"] = script["next_text"]
    return ret

if __name__ == "__main__":
    # ReturnText('intro-1')
    print(root)