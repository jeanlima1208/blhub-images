$Pasta = "C:\Users\user\Desktop\Tailandesas\JPG"
$Url = "http://163.176.237.176:8000/upload-gallery-bulk"

$AdminSecret = Read-Host "Digite o ADMIN_API_SECRET"

$Arquivos = Get-ChildItem -LiteralPath $Pasta -File |
    Where-Object {
        $_.Name -match '^[0-9]+(-[1-4])?\.jpg$'
    }

Write-Host ""
Write-Host "Arquivos encontrados: $($Arquivos.Count)"
Write-Host ""

if ($Arquivos.Count -eq 0) {
    Write-Host "Nenhuma imagem encontrada."
    exit
}

$Form = @{}

foreach ($Arquivo in $Arquivos) {
    $Form["files"] = $Arquivos
}

Write-Host "Enviando imagens para o R2..."
Write-Host ""

try {

    $Response = Invoke-RestMethod `
        -Uri $Url `
        -Method Post `
        -Headers @{
            "X-Admin-Secret" = $AdminSecret
        } `
        -Form @{
            files = $Arquivos
        }

    Write-Host ""
    Write-Host "========================================"
    Write-Host "UPLOAD CONCLUIDO"
    Write-Host "========================================"
    Write-Host ""

    Write-Host "Sucesso: $($Response.sucesso.Count)"
    Write-Host "Erros:   $($Response.erros.Count)"

    if ($Response.erros.Count -gt 0) {
        Write-Host ""
        Write-Host "ERROS:"
        $Response.erros | Format-Table
    }

}
catch {
    Write-Host ""
    Write-Host "ERRO NO UPLOAD:"
    Write-Host $_
}