# HELP

---

## Récupérer un formulaire

```bash
FORM_ID="your_form_id"
TOKEN="your_token"

curl --request GET \
  --url "https://api.tally.so/forms/${FORM_ID}" \
  --header "Authorization: Bearer ${TOKEN}" \
  | python3 -m json.tool --ensure-ascii=false > output.json
```