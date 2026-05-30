# HELP

---

## Récupérer un formulaire

### bash

```bash
FORM_ID="your_form_id"
TOKEN="your_token"

curl --request GET \
  --url "https://api.tally.so/forms/${FORM_ID}" \
  --header "Authorization: Bearer ${TOKEN}" \
  | python3 -m json.tool --ensure-ascii=false > output.json
```

### PowerShell

```PowerShell
$TOKEN = "tly-your_token"
$FORM_ID = "your_form_id"

$response = Invoke-RestMethod `
  -Method Get `
  -Uri "https://api.tally.so/forms/$FORM_ID" `
  -Headers @{
    Authorization = "Bearer $TOKEN"
  }

$response | ConvertTo-Json -Depth 100 | Out-File output.json -Encoding utf8
```
