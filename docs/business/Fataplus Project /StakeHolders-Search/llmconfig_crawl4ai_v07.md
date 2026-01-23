# Correct LLMConfig Usage for Crawl4AI v0.7+

## 1. LLMConfig Signature (as of v0.7+)

```python
from crawl4ai import LLMConfig

llm_config = LLMConfig(
    provider="openai",         # or "anthropic", "azure", etc.
    api_key=os.environ["OPENAI_API_KEY"],
    # Optionally, you can set model via environment variable (OPENAI_MODEL), or use the default for the provider.
    # No 'model' argument in the constructor.
    # For advanced config, see Crawl4AI docs.
)
```

- The `model` argument is no longer accepted in the constructor.
- The model is chosen based on the provider and environment variable (e.g., `OPENAI_MODEL`).
- For OpenAI, the default is usually `gpt-3.5-turbo` or `gpt-4-turbo` if available to your key.

## 2. Example Usage in Pipeline

```python
import os
from crawl4ai import LLMConfig

os.environ["OPENAI_API_KEY"] = "sk-..."  # Set your key

llm_config = LLMConfig(
    provider="openai",
    api_key=os.environ["OPENAI_API_KEY"]
)
```

## 3. To Specify a Model

- Set the environment variable before running your script:
  ```
  export OPENAI_MODEL=gpt-4-turbo
  python madagascar_stakeholders_pipeline.py
  ```
- Or, for Azure:
  ```
  export AZURE_OPENAI_MODEL=your-model
  export AZURE_OPENAI_API_KEY=your-key
  export AZURE_OPENAI_ENDPOINT=your-endpoint
  ```

## 4. Reference

- [Crawl4AI LLMConfig Docs](https://docs.crawl4ai.com/reference/llmconfig/)
- [Crawl4AI Quickstart](https://docs.crawl4ai.com/quickstart/)

---

**Next step:**  
- Remove the `model` argument from your LLMConfig in the pipeline script.
- Optionally set the model via environment variable if you want to use a specific OpenAI model.