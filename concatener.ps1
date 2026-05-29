Get-ChildItem -File -Recurse |
Where-Object {
    $_.Length -gt 0 -and
    $_.Length -lt 1MB -and
    $_.Extension -in ".txt",".log",".md",".csv",".py"
} |
ForEach-Object {

    $content = Get-Content $_.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue

    [PSCustomObject]@{
        path = $_.FullName
        size = $_.Length
        content = $content
    }
} | ConvertTo-Json -Depth 3 | Out-File resultat.json -Encoding utf8