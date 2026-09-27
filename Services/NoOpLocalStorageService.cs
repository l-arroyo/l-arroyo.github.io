using Microsoft.JSInterop;
using System.Text.Json.Serialization.Metadata;

namespace Portfolio.Services;

/// <summary>
/// No-op implementation used only during BlazorWasmPreRendering.Build's
/// server-side prerender, where there is no browser (and thus no localStorage).
/// </summary>
internal sealed class NoOpLocalStorageService : ILocalStorageService
{
    public double Length => 0;

    public void Clear() { }

    public TValue? GetItem<TValue>(string key, JsonTypeInfo<TValue>? typeInfo = null) => default;

    public string? Key(double index) => default;

    public void RemoveItem(string key) { }

    public void SetItem<TValue>(string key, TValue value, JsonTypeInfo<TValue>? typeInfo = null) { }
}